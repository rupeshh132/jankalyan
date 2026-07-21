package com.jankalyan.complaint.service;

import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;

import java.util.List;
import java.util.UUID;

public interface ComplaintService {
    ComplaintResponse createComplaint(CreateComplaintRequest request);
    ComplaintResponse getComplaintById(UUID id);
    List<ComplaintResponse> getMyComplaints();
    void deleteComplaint(UUID id);
}
