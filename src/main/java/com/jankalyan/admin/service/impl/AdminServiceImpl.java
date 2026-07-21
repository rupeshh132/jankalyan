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
import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import com.jankalyan.complainthistory.repository.ComplaintStatusHistoryRepository;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final ComplaintMapper complaintMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        return complaintRepository.getDashboardStatistics();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getComplaints(Pageable pageable) {
        return complaintRepository.findAll(pageable)
                .map(complaintMapper::toResponse);
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
                .build();

        historyRepository.save(history);
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
