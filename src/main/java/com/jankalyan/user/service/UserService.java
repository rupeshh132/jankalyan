package com.jankalyan.user.service;

import com.jankalyan.user.dto.request.UpdateProfileRequest;
import com.jankalyan.user.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getCurrentUserProfile();
    UserProfileResponse updateUserProfile(UpdateProfileRequest request);
}
