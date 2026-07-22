package com.jankalyan.complaint.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.category.entity.Category;
import com.jankalyan.category.repository.CategoryRepository;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complaint.mapper.ComplaintMapper;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.complaint.service.ComplaintService;
import com.jankalyan.complaint.specification.ComplaintSpecification;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ComplaintMapper complaintMapper;

    @Override
    @Transactional
    public ComplaintResponse createComplaint(CreateComplaintRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        User user = userRepository.getReferenceById(principal.getId());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Complaint complaint = complaintMapper.toEntity(request, user, category);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setDeleted(false);

        complaint = complaintRepository.save(complaint);
        
        log.info("Complaint created successfully with id: {}", complaint.getId());
        return complaintMapper.toResponse(complaint);
    }

    @Override
    public ComplaintResponse getComplaintById(UUID id) {
        Complaint complaint = complaintRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return complaintMapper.toResponse(complaint);
    }

    @Override
    public List<ComplaintResponse> getMyComplaints() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        List<Complaint> complaints = complaintRepository.findByUserIdAndIsDeletedFalse(principal.getId());
        
        return complaints.stream()
                .map(complaintMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public org.springframework.data.domain.Page<ComplaintResponse> getPublicComplaints(String search, UUID categoryId, ComplaintStatus status, org.springframework.data.domain.Pageable pageable) {
        return complaintRepository.findAll(
                ComplaintSpecification.getPublicComplaints(search, categoryId, status), 
                pageable
        ).map(complaintMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteComplaint(UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (!complaint.getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this complaint");
        }

        if (complaint.getStatus() != ComplaintStatus.SUBMITTED) {
            throw new BadRequestException("Only complaints in SUBMITTED status can be deleted");
        }

        complaint.setDeleted(true);
        complaintRepository.save(complaint);
        
        log.info("Complaint softly deleted with id: {}", id);
    }
}
