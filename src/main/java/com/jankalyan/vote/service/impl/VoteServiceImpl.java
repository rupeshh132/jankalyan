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
import com.jankalyan.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void addVote(UUID complaintId) {
        UUID userId = getCurrentUserId();
        
        Complaint complaint = complaintRepository.findByIdAndIsDeletedFalse(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
                
        if (voteRepository.existsByComplaintIdAndUserId(complaintId, userId)) {
            throw new BadRequestException("You have already voted for this complaint");
        }
        
        User user = userRepository.getReferenceById(userId);
        
        Vote vote = Vote.builder()
                .complaint(complaint)
                .user(user)
                .build();
                
        try {
            voteRepository.saveAndFlush(vote);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("You have already voted for this complaint");
        }
    }

    @Override
    @Transactional
    public void removeVote(UUID complaintId) {
        UUID userId = getCurrentUserId();
        
        if (!complaintRepository.existsByIdAndIsDeletedFalse(complaintId)) {
            throw new ResourceNotFoundException("Complaint not found");
        }
                
        Vote vote = voteRepository.findByComplaintIdAndUserId(complaintId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found"));
                
        voteRepository.delete(vote);
    }

    @Override
    public long getVoteCount(UUID complaintId) {
        if (!complaintRepository.existsByIdAndIsDeletedFalse(complaintId)) {
            throw new ResourceNotFoundException("Complaint not found");
        }
        return voteRepository.countByComplaintId(complaintId);
    }
    
    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getId();
        }
        throw new AccessDeniedException("User not authenticated");
    }
}
