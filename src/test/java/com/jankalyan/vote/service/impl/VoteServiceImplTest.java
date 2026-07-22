package com.jankalyan.vote.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.BadRequestException;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import com.jankalyan.vote.entity.Vote;
import com.jankalyan.vote.repository.VoteRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
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
class VoteServiceImplTest {

    @Mock private VoteRepository voteRepository;
    @Mock private ComplaintRepository complaintRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private VoteServiceImpl voteService;

    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(userId, "user@test.com", "pass", Collections.emptyList(), true);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAddVoteSuccessfully() {
        UUID complaintId = UUID.randomUUID();
        Complaint complaint = new Complaint();
        User user = new User();
        user.setId(userId);

        given(complaintRepository.findByIdAndIsDeletedFalse(complaintId)).willReturn(Optional.of(complaint));
        given(voteRepository.existsByComplaintIdAndUserId(complaintId, userId)).willReturn(false);
        given(userRepository.getReferenceById(userId)).willReturn(user);

        voteService.addVote(complaintId);

        ArgumentCaptor<Vote> voteCaptor = ArgumentCaptor.forClass(Vote.class);
        verify(voteRepository).saveAndFlush(voteCaptor.capture());

        Vote saved = voteCaptor.getValue();
        assertThat(saved.getComplaint()).isEqualTo(complaint);
        assertThat(saved.getUser()).isEqualTo(user);
    }

    @Test
    void shouldRejectDuplicateVoteCheckBeforeSave() {
        UUID complaintId = UUID.randomUUID();
        Complaint complaint = new Complaint();

        given(complaintRepository.findByIdAndIsDeletedFalse(complaintId)).willReturn(Optional.of(complaint));
        given(voteRepository.existsByComplaintIdAndUserId(complaintId, userId)).willReturn(true);

        assertThatThrownBy(() -> voteService.addVote(complaintId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already voted");
                
        verify(voteRepository, never()).saveAndFlush(any());
    }

    @Test
    void shouldRejectDuplicateVoteOnDataIntegrityViolation() {
        UUID complaintId = UUID.randomUUID();
        Complaint complaint = new Complaint();
        User user = new User();
        user.setId(userId);

        given(complaintRepository.findByIdAndIsDeletedFalse(complaintId)).willReturn(Optional.of(complaint));
        given(voteRepository.existsByComplaintIdAndUserId(complaintId, userId)).willReturn(false);
        given(userRepository.getReferenceById(userId)).willReturn(user);
        given(voteRepository.saveAndFlush(any(Vote.class))).willThrow(new DataIntegrityViolationException("duplicate"));

        assertThatThrownBy(() -> voteService.addVote(complaintId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already voted");
    }

    @Test
    void shouldReturnVoteCount() {
        UUID complaintId = UUID.randomUUID();
        given(complaintRepository.existsByIdAndIsDeletedFalse(complaintId)).willReturn(true);
        given(voteRepository.countByComplaintId(complaintId)).willReturn(5L);

        long count = voteService.getVoteCount(complaintId);

        assertThat(count).isEqualTo(5L);
    }

    @Test
    void shouldThrowWhenVotingOnNonExistentComplaint() {
        UUID complaintId = UUID.randomUUID();
        given(complaintRepository.findByIdAndIsDeletedFalse(complaintId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> voteService.addVote(complaintId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
