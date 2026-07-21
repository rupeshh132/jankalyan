package com.jankalyan.complaintimage.repository;

import com.jankalyan.complaintimage.entity.ComplaintImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplaintImageRepository extends JpaRepository<ComplaintImage, UUID> {
    List<ComplaintImage> findByComplaintIdOrderByCreatedAtAsc(UUID complaintId);
}
