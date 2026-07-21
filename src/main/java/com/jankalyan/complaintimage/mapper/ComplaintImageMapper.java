package com.jankalyan.complaintimage.mapper;

import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;
import com.jankalyan.complaintimage.entity.ComplaintImage;
import org.springframework.stereotype.Component;

@Component
public class ComplaintImageMapper {

    public ComplaintImageResponse toResponse(ComplaintImage image) {
        if (image == null) {
            return null;
        }

        return ComplaintImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .uploadedAt(image.getCreatedAt())
                .build();
    }
}
