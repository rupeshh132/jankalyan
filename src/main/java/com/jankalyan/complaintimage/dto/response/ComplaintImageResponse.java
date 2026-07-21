package com.jankalyan.complaintimage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintImageResponse {
    private UUID id;
    private String imageUrl;
    private LocalDateTime uploadedAt;
}
