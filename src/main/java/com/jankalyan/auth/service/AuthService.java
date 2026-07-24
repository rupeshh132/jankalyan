package com.jankalyan.auth.service;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.response.JwtAuthResponse;

public interface AuthService {
    void register(RegisterRequest registerRequest);
    AuthResult login(LoginRequest loginRequest);
    AuthResult googleLogin(com.jankalyan.auth.dto.request.GoogleAuthRequest request);
    void sendOtp(com.jankalyan.auth.dto.request.SendOtpRequest request);
    AuthResult verifyOtpLogin(com.jankalyan.auth.dto.request.VerifyOtpRequest request);
    AuthResult refresh(String refreshToken);
    void logout();

    record AuthResult(JwtAuthResponse jwtResponse, String refreshToken) {}
}
