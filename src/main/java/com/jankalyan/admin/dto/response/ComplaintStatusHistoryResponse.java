package com.jankalyan.admin.dto.response;

import com.jankalyan.complaint.entity.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintStatusHistoryResponse {
    private ComplaintStatus oldStatus;
    private ComplaintStatus newStatus;
    private String remarks;
    private String changedBy;
    private LocalDateTime changedAt;
}
