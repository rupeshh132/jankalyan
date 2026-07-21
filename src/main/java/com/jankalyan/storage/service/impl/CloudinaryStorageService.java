package com.jankalyan.storage.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.storage.dto.UploadResult;
import com.jankalyan.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryStorageService implements StorageService {

    private final Cloudinary cloudinary;

    @Override
    public UploadResult uploadFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new BadRequestException("File must not be empty");
            }
            
            Map uploadResponse = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "jankalyan/complaints",
                    "resource_type", "image",
                    "unique_filename", true,
                    "overwrite", false
            ));
            
            String imageUrl = uploadResponse.get("secure_url").toString();
            String publicId = uploadResponse.get("public_id").toString();
            
            log.info("File uploaded successfully to Cloudinary. Public ID: {}", publicId);
            
            return UploadResult.builder()
                    .imageUrl(imageUrl)
                    .publicId(publicId)
                    .build();
                    
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new BadRequestException("File upload failed");
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("File deleted successfully from Cloudinary. Public ID: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete file from Cloudinary", e);
            throw new BadRequestException("File deletion failed");
        }
    }
}
