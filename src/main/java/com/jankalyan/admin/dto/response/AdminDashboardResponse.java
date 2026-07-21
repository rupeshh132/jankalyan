package com.jankalyan.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalComplaints;
    private long submittedCount;
    private long underReviewCount;
    private long approvedCount;
    private long rejectedCount;
    private long resolvedCount;
}
