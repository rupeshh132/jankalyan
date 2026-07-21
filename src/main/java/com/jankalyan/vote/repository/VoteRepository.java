package com.jankalyan.vote.repository;

import com.jankalyan.vote.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    
    Optional<Vote> findByComplaintIdAndUserId(UUID complaintId, UUID userId);
    
    boolean existsByComplaintIdAndUserId(UUID complaintId, UUID userId);
    
    long countByComplaintId(UUID complaintId);
}
