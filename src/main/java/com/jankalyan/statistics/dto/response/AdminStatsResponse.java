package com.jankalyan.statistics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalComplaints;
    private long submittedCount;
    private long underReviewCount;
    private long resolvedCount;
    private long rejectedCount;
    
    private double averageResolutionTime;
    private long closedTodayCount;
    
    private Map<String, Long> monthlyTrend;
    private Map<String, Long> complaintsByCategory;
}
