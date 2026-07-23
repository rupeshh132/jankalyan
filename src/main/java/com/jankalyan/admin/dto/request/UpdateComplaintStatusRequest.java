package com.jankalyan.admin.dto.request;

import com.jankalyan.complaint.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateComplaintStatusRequest {
    
    @NotNull(message = "Status cannot be null")
    private ComplaintStatus status;

    @Size(max = 2000, message = "Remarks cannot exceed 2000 characters")
    private String remarks;
}
