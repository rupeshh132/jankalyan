package com.jankalyan.complaintimage.service;

import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ComplaintImageService {
    List<ComplaintImageResponse> uploadImages(UUID complaintId, List<MultipartFile> images);
    
    List<ComplaintImageResponse> getImages(UUID complaintId);
    
    void deleteImage(UUID imageId);
}
