package com.jankalyan.complaintimage.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;
import com.jankalyan.complaintimage.entity.ComplaintImage;
import com.jankalyan.complaintimage.mapper.ComplaintImageMapper;
import com.jankalyan.complaintimage.repository.ComplaintImageRepository;
import com.jankalyan.complaintimage.service.ComplaintImageService;
import com.jankalyan.storage.dto.UploadResult;
import com.jankalyan.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintImageServiceImpl implements ComplaintImageService {

    private final ComplaintImageRepository complaintImageRepository;
    private final ComplaintRepository complaintRepository;
    private final StorageService storageService;
    private final ComplaintImageMapper complaintImageMapper;
    private final ApplicationContext applicationContext;

    @Override
    // NOT @Transactional to avoid long-running DB connections during Cloudinary network I/O
    public List<ComplaintImageResponse> uploadImages(UUID complaintId, List<MultipartFile> images) {
        
        // --- PHASE A: Pre-flight Validations ---
        if (images == null || images.isEmpty()) {
            throw new BadRequestException("No images provided");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        if (complaint.isDeleted()) {
            throw new BadRequestException("Cannot upload images to a deleted complaint");
        }

        UserPrincipal principal = getCurrentUser();
        if (!complaint.getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not have permission to upload images for this complaint");
        }

        List<ComplaintImage> existingImages = complaintImageRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId);
        if (existingImages.size() + images.size() > 5) {
            throw new BadRequestException("Maximum 5 images allowed per complaint");
        }

        for (MultipartFile file : images) {
            if (file.isEmpty()) {
                throw new BadRequestException("Empty file detected");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new BadRequestException("Only image files are allowed");
            }
        }

        // --- PHASE B: Network Uploads (Outside Transaction) ---
        List<UploadResult> successfulUploads = new ArrayList<>();
        try {
            for (MultipartFile file : images) {
                UploadResult uploadResult = storageService.uploadFile(file);
                successfulUploads.add(uploadResult);
            }
        } catch (Exception e) {
            log.error("Cloudinary upload failed mid-batch. Cleaning up {} successful uploads.", successfulUploads.size(), e);
            for (UploadResult result : successfulUploads) {
                try {
                    storageService.deleteFile(result.getPublicId());
                } catch (Exception ex) {
                    log.error("Failed to delete orphaned Cloudinary image: {}", result.getPublicId(), ex);
                }
            }
            throw new BadRequestException("File upload process failed");
        }

        // --- PHASE C: Database Persistence (Handled in short Spring Data JPA transaction with Pessimistic Lock) ---
        List<ComplaintImage> savedImages;
        try {
            ComplaintImageServiceImpl self = applicationContext.getBean(ComplaintImageServiceImpl.class);
            savedImages = self.persistImagesWithLock(complaintId, successfulUploads, complaint);
        } catch (Exception e) {
            log.error("Database save failed. Cleaning up {} Cloudinary images.", successfulUploads.size(), e);
            for (UploadResult result : successfulUploads) {
                try {
                    storageService.deleteFile(result.getPublicId());
                } catch (Exception ex) {
                    log.error("Failed to delete orphaned Cloudinary image: {}", result.getPublicId(), ex);
                }
            }
            throw e;
        }

        log.info("Successfully uploaded {} images for complaint {}", savedImages.size(), complaintId);

        return savedImages.stream()
                .map(complaintImageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintImageResponse> getImages(UUID complaintId) {
        List<ComplaintImage> images = complaintImageRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId);
        return images.stream()
                .map(complaintImageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    // NOT @Transactional to prevent Cloudinary failure from rolling back DB
    public void deleteImage(UUID imageId) {
        
        // --- PHASE A: Pre-flight Validations ---
        ComplaintImage complaintImage = complaintImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

        UserPrincipal principal = getCurrentUser();
        if (!complaintImage.getComplaint().getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this image");
        }

        String publicId = complaintImage.getPublicId();

        // --- PHASE B: Database Delete (Handled in short Spring Data JPA transaction) ---
        complaintImageRepository.delete(complaintImage);

        // --- PHASE C: Network Delete (Outside Transaction) ---
        try {
            storageService.deleteFile(publicId);
            log.info("Successfully deleted image {}", imageId);
        } catch (Exception e) {
            // Never rollback the database. Log failure heavily.
            log.error("Failed to delete image {} from Cloudinary, but database record was cleanly deleted. PublicId: {}", imageId, publicId, e);
        }
    }

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    @Transactional
    public List<ComplaintImage> persistImagesWithLock(UUID complaintId, List<UploadResult> successfulUploads, Complaint transientComplaint) {
        // Acquire Pessimistic Write Lock
        Complaint lockedComplaint = complaintRepository.findByIdForUpdate(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        // Re-count under lock to prevent TOCTOU race conditions
        List<ComplaintImage> existingImages = complaintImageRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId);
        if (existingImages.size() + successfulUploads.size() > 5) {
            throw new BadRequestException("Maximum 5 images allowed per complaint");
        }

        List<ComplaintImage> imagesToSave = new ArrayList<>();
        for (UploadResult result : successfulUploads) {
            imagesToSave.add(ComplaintImage.builder()
                    .complaint(lockedComplaint)
                    .imageUrl(result.getImageUrl())
                    .publicId(result.getPublicId())
                    .build());
        }

        return complaintImageRepository.saveAll(imagesToSave);
    }
}
