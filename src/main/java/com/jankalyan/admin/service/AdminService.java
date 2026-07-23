package com.jankalyan.admin.service;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminService {
    
    AdminDashboardResponse getDashboard();
    
    Page<ComplaintResponse> getComplaints(String search, UUID categoryId, com.jankalyan.complaint.entity.ComplaintStatus status, Pageable pageable);

    com.jankalyan.admin.dto.response.AdminComplaintDetailResponse getComplaintDetailsForAdmin(UUID complaintId);
    
    void updateComplaintStatus(UUID complaintId, UpdateComplaintStatusRequest request);
    
    void deleteComplaint(UUID complaintId);
}
