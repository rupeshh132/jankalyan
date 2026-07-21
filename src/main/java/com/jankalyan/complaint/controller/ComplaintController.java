package com.jankalyan.complaint.controller;

import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaint Management", description = "APIs for managing civic complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @Operation(summary = "Create a new complaint", description = "Submit a new civic complaint to the system")
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request) {
        ComplaintResponse data = complaintService.createComplaint(request);
        
        ApiResponse<ComplaintResponse> response = ApiResponse.<ComplaintResponse>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Complaint created successfully")
                .data(data)
                .build();
                
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint details", description = "Fetch a complaint by its UUID")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(@PathVariable UUID id) {
        ComplaintResponse data = complaintService.getComplaintById(id);
        
        ApiResponse<ComplaintResponse> response = ApiResponse.<ComplaintResponse>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Complaint retrieved successfully")
                .data(data)
                .build();
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @Operation(summary = "Get my complaints", description = "Fetch all complaints created by the authenticated user")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getMyComplaints() {
        List<ComplaintResponse> data = complaintService.getMyComplaints();
        
        ApiResponse<List<ComplaintResponse>> response = ApiResponse.<List<ComplaintResponse>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Complaints retrieved successfully")
                .data(data)
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a complaint", description = "Soft delete a complaint by its UUID (Owner only)")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable UUID id) {
        complaintService.deleteComplaint(id);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Complaint deleted successfully")
                .data(null)
                .build();
                
        return ResponseEntity.ok(response);
    }
}
