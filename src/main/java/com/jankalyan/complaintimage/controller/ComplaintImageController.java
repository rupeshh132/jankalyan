package com.jankalyan.complaintimage.controller;

import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.complaintimage.dto.response.ComplaintImageResponse;
import com.jankalyan.complaintimage.service.ComplaintImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Complaint Image Management")
public class ComplaintImageController {

    private final ComplaintImageService complaintImageService;

    @PostMapping(value = "/complaints/{complaintId}/images", consumes = "multipart/form-data")
    @Operation(summary = "Upload images for a complaint")
    public ResponseEntity<ApiResponse<List<ComplaintImageResponse>>> uploadImages(
            @PathVariable UUID complaintId,
            @RequestParam("images") MultipartFile[] images) {
        
        List<ComplaintImageResponse> data = complaintImageService.uploadImages(complaintId, Arrays.asList(images));
        
        ApiResponse<List<ComplaintImageResponse>> response = ApiResponse.<List<ComplaintImageResponse>>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Images uploaded successfully")
                .data(data)
                .build();
                
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/complaints/images/{imageId}")
    @Operation(summary = "Delete a single uploaded image")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable UUID imageId) {
        
        complaintImageService.deleteImage(imageId);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Image deleted successfully")
                .data(null)
                .build();
                
        return ResponseEntity.ok(response);
    }
}
