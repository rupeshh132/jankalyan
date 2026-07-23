package com.jankalyan.complaint.service;

import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;

import java.util.List;
import java.util.UUID;

public interface ComplaintService {
    ComplaintResponse createComplaint(CreateComplaintRequest request);
    ComplaintResponse getComplaintById(UUID id);
    List<ComplaintResponse> getMyComplaints();
    org.springframework.data.domain.Page<ComplaintResponse> getPublicComplaints(String search, UUID categoryId, com.jankalyan.complaint.entity.ComplaintStatus status, org.springframework.data.domain.Pageable pageable);
    ComplaintResponse updateComplaint(UUID id, com.jankalyan.complaint.dto.request.UpdateComplaintRequest request);
    void deleteComplaint(UUID id);
}
