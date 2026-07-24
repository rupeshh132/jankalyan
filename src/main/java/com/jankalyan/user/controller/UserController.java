package com.jankalyan.user.controller;

import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.user.dto.request.UpdateProfileRequest;
import com.jankalyan.user.dto.response.UserProfileResponse;
import com.jankalyan.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile management APIs")
@PreAuthorize("isAuthenticated()")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Retrieves the profile of the currently authenticated user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile() {
        UserProfileResponse profile = userService.getCurrentUserProfile();
        
        return ResponseEntity.ok(ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .status(200)
                .message("Profile retrieved successfully")
                .data(profile)
                .build());
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile", description = "Updates the profile details of the currently authenticated user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse updatedProfile = userService.updateUserProfile(request);
        
        return ResponseEntity.ok(ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .status(200)
                .message("Profile updated successfully")
                .data(updatedProfile)
                .build());
    }

    @PostMapping(value = "/me/photo", consumes = "multipart/form-data")
    @Operation(summary = "Upload profile photo", description = "Uploads a new profile photo for the currently authenticated user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        UserProfileResponse updatedProfile = userService.uploadProfileImage(file);
        
        return ResponseEntity.ok(ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .status(200)
                .message("Profile photo uploaded successfully")
                .data(updatedProfile)
                .build());
    }
}
