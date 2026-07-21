package com.jankalyan.admin.service;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminService {
    
    AdminDashboardResponse getDashboard();
    
    Page<ComplaintResponse> getComplaints(Pageable pageable);
    
    void updateComplaintStatus(UUID complaintId, UpdateComplaintStatusRequest request);
    
    void deleteComplaint(UUID complaintId);
}
