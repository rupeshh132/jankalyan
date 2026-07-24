package com.jankalyan.statistics.service.impl;

import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.statistics.dto.response.PublicStatsResponse;
import com.jankalyan.statistics.service.StatisticsService;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PublicStatsResponse getPublicStatistics() {
        AdminDashboardResponse adminStats = complaintRepository.getDashboardStatistics();
        long totalUsers = userRepository.count();

        // Include SUBMITTED, UNDER_REVIEW, APPROVED in "in-progress" conceptually for the public
        long inProgress = adminStats.getSubmittedCount() 
                        + adminStats.getUnderReviewCount() 
                        + adminStats.getApprovedCount();

        return PublicStatsResponse.builder()
                .totalReports(adminStats.getTotalComplaints())
                .resolvedReports(adminStats.getResolvedCount())
                .inProgressReports(inProgress)
                .activeUsers(totalUsers)
                .build();
    }
}
