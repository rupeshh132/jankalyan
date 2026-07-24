package com.jankalyan.user.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.storage.dto.UploadResult;
import com.jankalyan.storage.service.StorageService;
import com.jankalyan.user.dto.request.UpdateProfileRequest;
import com.jankalyan.user.dto.response.UserProfileResponse;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import com.jankalyan.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        UUID userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(UpdateProfileRequest request) {
        UUID userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserProfileResponse uploadProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new com.jankalyan.common.exception.BadRequestException("Empty file detected");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new com.jankalyan.common.exception.BadRequestException("Only image files are allowed");
        }

        UUID userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UploadResult uploadResult = storageService.uploadFile(file);
        
        user.setProfileImage(uploadResult.getImageUrl());
        User updatedUser = userRepository.save(user);
        
        return mapToResponse(updatedUser);
    }

    private UUID getCurrentUserId() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getId();
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage())
                .build();
    }
}
