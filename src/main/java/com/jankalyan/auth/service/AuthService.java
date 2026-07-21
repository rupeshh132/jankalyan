package com.jankalyan.auth.service;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.response.JwtAuthResponse;

public interface AuthService {
    void register(RegisterRequest registerRequest);
    AuthResult login(LoginRequest loginRequest);
    AuthResult refresh(String refreshToken);
    void logout();

    record AuthResult(JwtAuthResponse jwtResponse, String refreshToken) {}
}
