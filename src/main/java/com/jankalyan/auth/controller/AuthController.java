package com.jankalyan.auth.controller;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.request.ForgotPasswordRequest;
import com.jankalyan.auth.dto.request.ResetPasswordRequest;
import com.jankalyan.auth.service.AuthService;
import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.config.JwtProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProperties jwtProperties;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        ApiResponse<Void> response = new ApiResponse<>(true, HttpStatus.CREATED.value(), "Registration successful", null, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse httpResponse) {
        AuthService.AuthResult result = authService.login(request);
        setRefreshTokenCookie(httpResponse, result.refreshToken());
        
        ApiResponse<Object> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Success", result.jwtResponse(), LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<Object>> googleLogin(@Valid @RequestBody com.jankalyan.auth.dto.request.GoogleAuthRequest request, HttpServletResponse httpResponse) {
        AuthService.AuthResult result = authService.googleLogin(request);
        setRefreshTokenCookie(httpResponse, result.refreshToken());
        
        ApiResponse<Object> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Success", result.jwtResponse(), LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody com.jankalyan.auth.dto.request.SendOtpRequest request) {
        authService.sendOtp(request);
        
        ApiResponse<Void> response = new ApiResponse<>(true, HttpStatus.OK.value(), "OTP sent to your registered email successfully", null, LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@Valid @RequestBody com.jankalyan.auth.dto.request.VerifyOtpRequest request, HttpServletResponse httpResponse) {
        AuthService.AuthResult result = authService.verifyOtpLogin(request);
        setRefreshTokenCookie(httpResponse, result.refreshToken());
        
        ApiResponse<Object> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Success", result.jwtResponse(), LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Object>> refresh(HttpServletRequest request, HttpServletResponse httpResponse) {
        Cookie cookie = WebUtils.getCookie(request, "refresh_token");
        if (cookie == null || cookie.getValue() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, HttpStatus.UNAUTHORIZED.value(), "Refresh token is missing", null, LocalDateTime.now()));
        }

        AuthService.AuthResult result = authService.refresh(cookie.getValue());
        setRefreshTokenCookie(httpResponse, result.refreshToken());

        ApiResponse<Object> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Success", result.jwtResponse(), LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        authService.logout();
        
        // Clear refresh token cookie
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
                
        response.addHeader("Set-Cookie", cookie.toString());
        
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, HttpStatus.OK.value(), "Logged out successfully", null, LocalDateTime.now());
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        ApiResponse<Void> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Password reset OTP sent to your email", null, LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        ApiResponse<Void> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Password has been reset successfully", null, LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(jwtProperties.getRefreshExpirationDays() * 24 * 60 * 60)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
