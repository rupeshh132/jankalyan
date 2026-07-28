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
        Object[] raw = complaintRepository.getDashboardStatisticsRaw();
        long totalComplaints = ((Number) raw[0]).longValue();
        long submitted       = ((Number) raw[1]).longValue();
        long underReview     = ((Number) raw[2]).longValue();
        long approved        = ((Number) raw[3]).longValue();
        long rejected        = ((Number) raw[4]).longValue();
        long resolved        = ((Number) raw[5]).longValue();
        long totalUsers = userRepository.count();

        long inProgress = submitted + underReview + approved;

        return PublicStatsResponse.builder()
                .totalReports(totalComplaints)
                .resolvedReports(resolved)
                .inProgressReports(inProgress)
                .activeUsers(totalUsers)
                .build();
    }
}
