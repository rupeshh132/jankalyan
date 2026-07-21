package com.jankalyan.auth.service;

import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.user.entity.User;
import java.util.UUID;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUserId(UUID userId);
}
