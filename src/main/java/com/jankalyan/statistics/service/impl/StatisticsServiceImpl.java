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
        long total       = complaintRepository.countByIsDeletedFalse();
        long submitted   = complaintRepository.countByStatusAndIsDeletedFalse(com.jankalyan.complaint.entity.ComplaintStatus.SUBMITTED);
        long underReview = complaintRepository.countByStatusAndIsDeletedFalse(com.jankalyan.complaint.entity.ComplaintStatus.UNDER_REVIEW);
        long approved    = complaintRepository.countByStatusAndIsDeletedFalse(com.jankalyan.complaint.entity.ComplaintStatus.APPROVED);
        long resolved    = complaintRepository.countByStatusAndIsDeletedFalse(com.jankalyan.complaint.entity.ComplaintStatus.RESOLVED);
        long totalUsers  = userRepository.count();

        long inProgress = submitted + underReview + approved;

        return PublicStatsResponse.builder()
                .totalReports(total)
                .resolvedReports(resolved)
                .inProgressReports(inProgress)
                .activeUsers(totalUsers)
                .build();
    }
}
