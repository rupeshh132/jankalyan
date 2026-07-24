package com.jankalyan.user.service;

import com.jankalyan.user.dto.request.UpdateProfileRequest;
import com.jankalyan.user.dto.response.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserProfileResponse getCurrentUserProfile();
    UserProfileResponse updateUserProfile(UpdateProfileRequest request);
    UserProfileResponse uploadProfileImage(MultipartFile file);
}
