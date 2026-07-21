package com.jankalyan.admin.controller;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.admin.service.AdminService;
import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Administrative complaint management APIs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics", description = "Retrieves aggregated counts of complaints by status")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboard();
        
        return ResponseEntity.ok(ApiResponse.<AdminDashboardResponse>builder()
                .success(true)
                .status(200)
                .message("Dashboard statistics retrieved successfully")
                .data(dashboard)
                .build());
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get all complaints", description = "Retrieves a paginated list of all complaints, including soft-deleted ones")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>> getComplaints(Pageable pageable) {
        Page<ComplaintResponse> complaints = adminService.getComplaints(pageable);
        
        return ResponseEntity.ok(ApiResponse.<Page<ComplaintResponse>>builder()
                .success(true)
                .status(200)
                .message("Complaints retrieved successfully")
                .data(complaints)
                .build());
    }

    @PatchMapping("/complaints/{complaintId}/status")
    @Operation(summary = "Update complaint status", description = "Updates the status of a specific complaint and creates an audit history record")
    public ResponseEntity<ApiResponse<Void>> updateComplaintStatus(
            @PathVariable UUID complaintId,
            @Valid @RequestBody UpdateComplaintStatusRequest request) {
        
        adminService.updateComplaintStatus(complaintId, request);
        
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .status(200)
                .message("Complaint status updated successfully")
                .build());
    }

    @DeleteMapping("/complaints/{complaintId}")
    @Operation(summary = "Delete complaint", description = "Performs a soft delete on a specific complaint")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable UUID complaintId) {
        
        adminService.deleteComplaint(complaintId);
        
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .status(200)
                .message("Complaint deleted successfully")
                .build());
    }
}
