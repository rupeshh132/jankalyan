package com.jankalyan.statistics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsResponse {
    private long totalReports;
    private long resolvedReports;
    private long inProgressReports;
    private long activeUsers;
}
