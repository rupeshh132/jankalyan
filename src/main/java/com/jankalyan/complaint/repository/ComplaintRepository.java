package com.jankalyan.complaint.repository;

import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    List<Complaint> findByUserId(UUID userId);
    
    @EntityGraph(attributePaths = {"category"})
    List<Complaint> findByUserIdAndIsDeletedFalse(UUID userId);
    
    Optional<Complaint> findByIdAndIsDeletedFalse(UUID id);
    
    List<Complaint> findByStatus(ComplaintStatus status);
}
