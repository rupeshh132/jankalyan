package com.jankalyan.user.service.impl;

import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.ResourceNotFoundException;
import com.jankalyan.user.dto.request.UpdateProfileRequest;
import com.jankalyan.user.dto.response.UserProfileResponse;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import com.jankalyan.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
                .build();
    }
}
