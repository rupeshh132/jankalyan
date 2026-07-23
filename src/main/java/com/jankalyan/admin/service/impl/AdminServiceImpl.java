package com.jankalyan.admin.service.impl;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.admin.service.AdminService;
import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complaint.mapper.ComplaintMapper;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.admin.dto.response.AdminComplaintDetailResponse;
import com.jankalyan.admin.dto.response.ComplaintStatusHistoryResponse;
import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import com.jankalyan.complainthistory.repository.ComplaintStatusHistoryRepository;
import com.jankalyan.complaintimage.service.ComplaintImageService;
import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;
import com.jankalyan.complaint.specification.ComplaintSpecification;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.context.ApplicationEventPublisher;
import com.jankalyan.notification.event.NotificationEvent;
import com.jankalyan.notification.entity.NotificationType;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final ComplaintMapper complaintMapper;
    private final UserRepository userRepository;
    private final ComplaintImageService imageService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        AdminDashboardResponse response = complaintRepository.getDashboardStatistics();
        
        List<Object[]> categoryCounts = complaintRepository.countComplaintsByCategory();
        java.util.Map<String, Long> categoryMap = new java.util.HashMap<>();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], ((Number) row[1]).longValue());
        }
        response.setComplaintsByCategory(categoryMap);

        List<Object[]> monthlyCounts = complaintRepository.countComplaintsByMonth();
        java.util.Map<String, Long> monthlyMap = new java.util.LinkedHashMap<>(); // Keep ordered
        for (Object[] row : monthlyCounts) {
            monthlyMap.put((String) row[0], ((Number) row[1]).longValue());
        }
        response.setMonthlyTrend(monthlyMap);

        Double avgResolutionTime = complaintRepository.getAverageResolutionTimeInHours();
        response.setAverageResolutionTime(avgResolutionTime != null ? avgResolutionTime : 0.0);

        Long closedToday = complaintRepository.countClosedToday();
        response.setClosedTodayCount(closedToday != null ? closedToday : 0L);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getComplaints(String search, UUID categoryId, ComplaintStatus status, Pageable pageable) {
        return complaintRepository.findAll(ComplaintSpecification.getAdminComplaints(search, categoryId, status), pageable)
                .map(complaintMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminComplaintDetailResponse getComplaintDetailsForAdmin(UUID complaintId) {
        Complaint complaint = complaintRepository.findByIdWithDetails(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        List<ComplaintStatusHistory> historyList = historyRepository.findByComplaintIdOrderByCreatedAtDesc(complaintId);
        
        List<ComplaintStatusHistoryResponse> historyResponses = historyList.stream().map(h -> 
            ComplaintStatusHistoryResponse.builder()
                .oldStatus(h.getOldStatus())
                .newStatus(h.getNewStatus())
                .remarks(h.getRemarks())
                .changedBy(h.getChangedBy().getFullName() + " (" + h.getChangedBy().getEmail() + ")")
                .changedAt(h.getCreatedAt())
                .build()
        ).collect(Collectors.toList());

        List<ComplaintImageResponse> images = imageService.getImages(complaintId);

        return AdminComplaintDetailResponse.builder()
                .id(complaint.getId())
                .userId(complaint.getUser().getId())
                .userName(complaint.getUser().getFullName())
                .userEmail(complaint.getUser().getEmail())
                .categoryId(complaint.getCategory().getId())
                .categoryName(complaint.getCategory().getName())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .address(complaint.getAddress())
                .city(complaint.getCity())
                .state(complaint.getState())
                .ward(complaint.getWard())
                .pincode(complaint.getPincode())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .isAnonymous(complaint.isAnonymous())
                .isDeleted(complaint.isDeleted())
                .images(images)
                .statusHistory(historyResponses)
                .build();
    }

    @Override
    @Transactional
    public void updateComplaintStatus(UUID complaintId, UpdateComplaintStatusRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) {
            throw new BadRequestException("Complaint is already in the requested status.");
        }

        validateTransition(oldStatus, newStatus);

        complaint.setStatus(newStatus);

        UUID adminId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User adminRef = userRepository.getReferenceById(adminId);

        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(adminRef)
                .remarks(request.getRemarks())
                .build();

        historyRepository.save(history);

        NotificationType type = switch (newStatus) {
            case RESOLVED -> NotificationType.RESOLUTION;
            case REJECTED -> NotificationType.REJECTION;
            default -> NotificationType.STATUS_UPDATE;
        };

        String message = "Your complaint regarding '" + complaint.getTitle() + "' status has been updated to " + newStatus.name().replace("_", " ") + ".";
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            message += " Admin remarks: " + request.getRemarks();
        }

        eventPublisher.publishEvent(NotificationEvent.builder()
                .source(this)
                .user(complaint.getUser())
                .title("Complaint Status Updated")
                .message(message)
                .type(type)
                .referenceId(complaint.getId())
                .actionUrl("/complaint/" + complaint.getId()) // Ensure frontend has this route
                .build());
    }

    @Override
    @Transactional
    public void deleteComplaint(UUID complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        if (complaint.isDeleted()) {
            throw new BadRequestException("Complaint is already deleted.");
        }

        complaint.setDeleted(true);
    }

    private void validateTransition(ComplaintStatus oldStatus, ComplaintStatus newStatus) {
        boolean valid = switch (oldStatus) {
            case SUBMITTED -> newStatus == ComplaintStatus.UNDER_REVIEW;
            case UNDER_REVIEW -> newStatus == ComplaintStatus.APPROVED || newStatus == ComplaintStatus.REJECTED;
            case APPROVED -> newStatus == ComplaintStatus.RESOLVED;
            case REJECTED, RESOLVED -> false; // Terminal states
        };

        if (!valid) {
            throw new BadRequestException("Invalid status transition from " + oldStatus + " to " + newStatus);
        }
    }
}
