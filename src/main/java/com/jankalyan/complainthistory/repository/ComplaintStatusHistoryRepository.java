package com.jankalyan.complainthistory.repository;

import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, UUID> {
    
    List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtDesc(UUID complaintId);
}
