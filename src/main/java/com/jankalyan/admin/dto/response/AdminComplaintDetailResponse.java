package com.jankalyan.admin.dto.response;

import com.jankalyan.complaint.entity.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminComplaintDetailResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userEmail;
    private UUID categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String city;
    private String state;
    private String ward;
    private String pincode;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAnonymous;
    private boolean isDeleted;

    private List<ComplaintImageResponse> images;
    private List<ComplaintStatusHistoryResponse> statusHistory;
}
