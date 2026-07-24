package com.jankalyan.statistics.controller;

import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.statistics.dto.response.PublicStatsResponse;
import com.jankalyan.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "APIs for public and admin statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/public")
    @Operation(summary = "Get public statistics", description = "Retrieves aggregated counts of reports and users for the public landing page")
    public ResponseEntity<ApiResponse<PublicStatsResponse>> getPublicStatistics() {
        PublicStatsResponse stats = statisticsService.getPublicStatistics();
        
        return ResponseEntity.ok(ApiResponse.<PublicStatsResponse>builder()
                .success(true)
                .status(200)
                .message("Public statistics retrieved successfully")
                .data(stats)
                .build());
    }
}
