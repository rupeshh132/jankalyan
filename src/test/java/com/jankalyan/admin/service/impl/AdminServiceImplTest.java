package com.jankalyan.admin.service.impl;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complaint.mapper.ComplaintMapper;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import com.jankalyan.complainthistory.repository.ComplaintStatusHistoryRepository;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock private ComplaintRepository complaintRepository;
    @Mock private ComplaintStatusHistoryRepository historyRepository;
    @Mock private ComplaintMapper complaintMapper;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    private UUID adminId;

    @BeforeEach
    void setUp() {
        adminId = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(adminId, "admin@test.com", "pass", Collections.emptyList(), true);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturnDashboardStatistics() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        given(complaintRepository.getDashboardStatistics()).willReturn(response);

        AdminDashboardResponse result = adminService.getDashboard();

        assertThat(result).isEqualTo(response);
    }

    @Test
    void shouldUpdateStatusLegally() {
        UUID complaintId = UUID.randomUUID();
        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        request.setStatus(ComplaintStatus.UNDER_REVIEW);

        Complaint complaint = new Complaint();
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        
        User adminUser = new User();
        adminUser.setId(adminId);

        given(complaintRepository.findById(complaintId)).willReturn(Optional.of(complaint));
        given(userRepository.getReferenceById(adminId)).willReturn(adminUser);

        adminService.updateComplaintStatus(complaintId, request);

        assertThat(complaint.getStatus()).isEqualTo(ComplaintStatus.UNDER_REVIEW);
        
        ArgumentCaptor<ComplaintStatusHistory> historyCaptor = ArgumentCaptor.forClass(ComplaintStatusHistory.class);
        verify(historyRepository).save(historyCaptor.capture());
        
        ComplaintStatusHistory history = historyCaptor.getValue();
        assertThat(history.getOldStatus()).isEqualTo(ComplaintStatus.SUBMITTED);
        assertThat(history.getNewStatus()).isEqualTo(ComplaintStatus.UNDER_REVIEW);
        assertThat(history.getChangedBy().getId()).isEqualTo(adminId);
        assertThat(history.getComplaint()).isEqualTo(complaint);
    }

    @Test
    void shouldThrowOnDuplicateStatusUpdate() {
        UUID complaintId = UUID.randomUUID();
        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        request.setStatus(ComplaintStatus.SUBMITTED); // Same as current

        Complaint complaint = new Complaint();
        complaint.setStatus(ComplaintStatus.SUBMITTED);

        given(complaintRepository.findById(complaintId)).willReturn(Optional.of(complaint));

        assertThatThrownBy(() -> adminService.updateComplaintStatus(complaintId, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Complaint is already in the requested status");
                
        verify(historyRepository, never()).save(any());
    }

    @Test
    void shouldThrowOnIllegalStatusTransition() {
        UUID complaintId = UUID.randomUUID();
        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        request.setStatus(ComplaintStatus.RESOLVED); // Invalid jump

        Complaint complaint = new Complaint();
        complaint.setStatus(ComplaintStatus.SUBMITTED);

        given(complaintRepository.findById(complaintId)).willReturn(Optional.of(complaint));

        assertThatThrownBy(() -> adminService.updateComplaintStatus(complaintId, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid status transition");
                
        verify(historyRepository, never()).save(any());
    }

    @Test
    void shouldSoftDeleteComplaint() {
        UUID complaintId = UUID.randomUUID();
        Complaint complaint = new Complaint();
        complaint.setDeleted(false);

        given(complaintRepository.findById(complaintId)).willReturn(Optional.of(complaint));

        adminService.deleteComplaint(complaintId);

        assertThat(complaint.isDeleted()).isTrue();
    }

    @Test
    void shouldThrowWhenDeletingAlreadyDeletedComplaint() {
        UUID complaintId = UUID.randomUUID();
        Complaint complaint = new Complaint();
        complaint.setDeleted(true);

        given(complaintRepository.findById(complaintId)).willReturn(Optional.of(complaint));

        assertThatThrownBy(() -> adminService.deleteComplaint(complaintId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Complaint is already deleted");
    }
    
    @Test
    void shouldThrowWhenComplaintNotFoundForStatusUpdate() {
        UUID complaintId = UUID.randomUUID();
        given(complaintRepository.findById(complaintId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.updateComplaintStatus(complaintId, new UpdateComplaintStatusRequest()))
                .isInstanceOf(ResourceNotFoundException.class);
                
        verify(historyRepository, never()).save(any());
    }
}
