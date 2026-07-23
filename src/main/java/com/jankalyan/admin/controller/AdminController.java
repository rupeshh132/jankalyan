package com.jankalyan.admin.controller;

import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.dto.response.AdminDashboardResponse;
import com.jankalyan.admin.service.AdminService;
import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.admin.dto.response.AdminComplaintDetailResponse;
import com.jankalyan.complaint.entity.ComplaintStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Administrative complaint management APIs")
@PreAuthorize("hasRole('ADMIN')")
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
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>> getComplaints(
            @Parameter(description = "Search across title, description, address, category, and user info") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by specific Category UUID") @RequestParam(required = false) UUID categoryId,
            @Parameter(description = "Filter by complaint status") @RequestParam(required = false) ComplaintStatus status,
            Pageable pageable) {
        Page<ComplaintResponse> complaints = adminService.getComplaints(search, categoryId, status, pageable);
        
        return ResponseEntity.ok(ApiResponse.<Page<ComplaintResponse>>builder()
                .success(true)
                .status(200)
                .message("Complaints retrieved successfully")
                .data(complaints)
                .build());
    }

    @GetMapping("/complaints/{complaintId}")
    @Operation(summary = "Get complaint details for admin", description = "Retrieves complaint details including full status history and remarks")
    public ResponseEntity<ApiResponse<AdminComplaintDetailResponse>> getComplaintDetails(@PathVariable UUID complaintId) {
        AdminComplaintDetailResponse details = adminService.getComplaintDetailsForAdmin(complaintId);
        
        return ResponseEntity.ok(ApiResponse.<AdminComplaintDetailResponse>builder()
                .success(true)
                .status(200)
                .message("Complaint details retrieved successfully")
                .data(details)
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
