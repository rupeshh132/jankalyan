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
    
    @EntityGraph(attributePaths = {"user", "category"})
    @Query("SELECT c FROM Complaint c WHERE c.id = :id")
    Optional<Complaint> findByIdWithDetails(@Param("id") UUID id);
    
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
    
    @Query("SELECT cat.name, COUNT(c.id) FROM Category cat LEFT JOIN Complaint c ON c.category = cat AND c.isDeleted = false GROUP BY cat.name")
    List<Object[]> countComplaintsByCategory();

    @Query(value = "WITH RECURSIVE months AS ( " +
                   "    SELECT DATE_FORMAT(CURDATE() - INTERVAL 11 MONTH, '%Y-%m') AS month, CURDATE() - INTERVAL 11 MONTH AS dt " +
                   "    UNION ALL " +
                   "    SELECT DATE_FORMAT(dt + INTERVAL 1 MONTH, '%Y-%m'), dt + INTERVAL 1 MONTH " +
                   "    FROM months " +
                   "    WHERE dt + INTERVAL 1 MONTH <= CURDATE() " +
                   ") " +
                   "SELECT m.month, COUNT(c.id) " +
                   "FROM months m " +
                   "LEFT JOIN complaints c ON DATE_FORMAT(c.created_at, '%Y-%m') = m.month AND c.is_deleted = false " +
                   "GROUP BY m.month " +
                   "ORDER BY m.month DESC", nativeQuery = true)
    List<Object[]> countComplaintsByMonth();

    @Query(value = "SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) FROM complaints WHERE status = 'RESOLVED' AND is_deleted = false", nativeQuery = true)
    Double getAverageResolutionTimeInHours();

    @Query(value = "SELECT COUNT(*) FROM complaints WHERE (status = 'RESOLVED' OR status = 'REJECTED') AND is_deleted = false AND DATE(updated_at) = CURDATE()", nativeQuery = true)
    Long countClosedToday();
    
    List<Complaint> findByStatus(ComplaintStatus status);

    @EntityGraph(attributePaths = {"category"})
    org.springframework.data.domain.Page<Complaint> findAll(org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    org.springframework.data.domain.Page<Complaint> findByIsDeletedFalse(org.springframework.data.domain.Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Complaint c WHERE c.id = :id")
    Optional<Complaint> findByIdForUpdate(@Param("id") UUID id);
}
