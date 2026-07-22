package com.jankalyan.complaint.repository;

import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID>, JpaSpecificationExecutor<Complaint> {
    List<Complaint> findByUserId(UUID userId);
    
    @EntityGraph(attributePaths = {"category"})
    List<Complaint> findByUserIdAndIsDeletedFalse(UUID userId);
    
    Optional<Complaint> findByIdAndIsDeletedFalse(UUID id);
    
    boolean existsByIdAndIsDeletedFalse(UUID id);
    
    @Query("SELECT new com.jankalyan.admin.dto.response.AdminDashboardResponse(" +
           "COUNT(c), " +
           "COALESCE(SUM(CASE WHEN c.status = 'SUBMITTED' THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN c.status = 'UNDER_REVIEW' THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN c.status = 'APPROVED' THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN c.status = 'REJECTED' THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN c.status = 'RESOLVED' THEN 1L ELSE 0L END), 0L)) " +
           "FROM Complaint c WHERE c.isDeleted = false")
    com.jankalyan.admin.dto.response.AdminDashboardResponse getDashboardStatistics();
    
    List<Complaint> findByStatus(ComplaintStatus status);

    @EntityGraph(attributePaths = {"category"})
    org.springframework.data.domain.Page<Complaint> findAll(org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    org.springframework.data.domain.Page<Complaint> findByIsDeletedFalse(org.springframework.data.domain.Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Complaint c WHERE c.id = :id")
    Optional<Complaint> findByIdForUpdate(@Param("id") UUID id);
}
