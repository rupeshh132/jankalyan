package com.jankalyan.complaint.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.category.entity.Category;
import com.jankalyan.category.repository.CategoryRepository;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complaint.mapper.ComplaintMapper;
import com.jankalyan.complaint.repository.ComplaintRepository;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceImplTest {

    @Mock private ComplaintRepository complaintRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private UserRepository userRepository;
    @Mock private ComplaintMapper complaintMapper;

    @InjectMocks
    private ComplaintServiceImpl complaintService;

    private UUID userId;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        principal = new UserPrincipal(userId, "test@test.com", "pass", Collections.emptyList(), true);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldCreateComplaintSuccessfully() {
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setCategoryId(UUID.randomUUID());
        request.setTitle("Title");
        
        User user = new User();
        user.setId(userId);
        
        Category category = new Category();
        
        Complaint mappedComplaint = new Complaint();
        Complaint savedComplaint = new Complaint();
        savedComplaint.setId(UUID.randomUUID());
        
        ComplaintResponse response = new ComplaintResponse();

        given(userRepository.getReferenceById(userId)).willReturn(user);
        given(categoryRepository.findById(request.getCategoryId())).willReturn(Optional.of(category));
        given(complaintMapper.toEntity(request, user, category)).willReturn(mappedComplaint);
        given(complaintRepository.save(any(Complaint.class))).willReturn(savedComplaint);
        given(complaintMapper.toResponse(savedComplaint)).willReturn(response);

        ComplaintResponse result = complaintService.createComplaint(request);

        assertThat(result).isEqualTo(response);

        ArgumentCaptor<Complaint> captor = ArgumentCaptor.forClass(Complaint.class);
        verify(complaintRepository).save(captor.capture());
        Complaint saved = captor.getValue();
        assertThat(saved.getStatus()).isEqualTo(ComplaintStatus.SUBMITTED);
        assertThat(saved.isDeleted()).isFalse();
    }

    @Test
    void shouldThrowWhenCategoryNotFoundDuringCreation() {
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setCategoryId(UUID.randomUUID());

        given(categoryRepository.findById(request.getCategoryId())).willReturn(Optional.empty());

        assertThatThrownBy(() -> complaintService.createComplaint(request))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(complaintRepository, never()).save(any());
    }

    @Test
    void shouldGetComplaintById() {
        UUID id = UUID.randomUUID();
        Complaint complaint = new Complaint();
        ComplaintResponse response = new ComplaintResponse();

        given(complaintRepository.findByIdAndIsDeletedFalse(id)).willReturn(Optional.of(complaint));
        given(complaintMapper.toResponse(complaint)).willReturn(response);

        ComplaintResponse result = complaintService.getComplaintById(id);

        assertThat(result).isEqualTo(response);
    }

    @Test
    void shouldThrowWhenComplaintNotFound() {
        UUID id = UUID.randomUUID();
        given(complaintRepository.findByIdAndIsDeletedFalse(id)).willReturn(Optional.empty());

        assertThatThrownBy(() -> complaintService.getComplaintById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldGetMyComplaints() {
        Complaint complaint = new Complaint();
        ComplaintResponse response = new ComplaintResponse();

        given(complaintRepository.findByUserIdAndIsDeletedFalse(userId)).willReturn(List.of(complaint));
        given(complaintMapper.toResponse(complaint)).willReturn(response);

        List<ComplaintResponse> result = complaintService.getMyComplaints();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(response);
    }

    @Test
    void shouldSoftDeleteComplaint() {
        UUID id = UUID.randomUUID();
        Complaint complaint = new Complaint();
        User user = new User();
        user.setId(userId);
        complaint.setUser(user);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setDeleted(false);

        given(complaintRepository.findById(id)).willReturn(Optional.of(complaint));

        complaintService.deleteComplaint(id);

        assertThat(complaint.isDeleted()).isTrue();
        verify(complaintRepository).save(complaint);
    }

    @Test
    void shouldThrowWhenDeletingSomeoneElsesComplaint() {
        UUID id = UUID.randomUUID();
        Complaint complaint = new Complaint();
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID()); // different ID
        complaint.setUser(otherUser);

        given(complaintRepository.findById(id)).willReturn(Optional.of(complaint));

        assertThatThrownBy(() -> complaintService.deleteComplaint(id))
                .isInstanceOf(AccessDeniedException.class);
        verify(complaintRepository, never()).save(any());
    }

    @Test
    void shouldThrowWhenDeletingComplaintNotSubmitted() {
        UUID id = UUID.randomUUID();
        Complaint complaint = new Complaint();
        User user = new User();
        user.setId(userId);
        complaint.setUser(user);
        complaint.setStatus(ComplaintStatus.UNDER_REVIEW); // Not SUBMITTED

        given(complaintRepository.findById(id)).willReturn(Optional.of(complaint));

        assertThatThrownBy(() -> complaintService.deleteComplaint(id))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Only complaints in SUBMITTED status can be deleted");
        verify(complaintRepository, never()).save(any());
    }
}
