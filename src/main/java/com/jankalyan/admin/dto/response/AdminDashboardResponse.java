package com.jankalyan.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

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
    
    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> monthlyTrend;
    private double averageResolutionTime; // In hours or days
    private long closedTodayCount;

    // Constructor for JPQL Query
    public AdminDashboardResponse(long totalComplaints, long submittedCount, long underReviewCount, 
                                  long approvedCount, long rejectedCount, long resolvedCount) {
        this.totalComplaints = totalComplaints;
        this.submittedCount = submittedCount;
        this.underReviewCount = underReviewCount;
        this.approvedCount = approvedCount;
        this.rejectedCount = rejectedCount;
        this.resolvedCount = resolvedCount;
    }
}
