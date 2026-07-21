package com.jankalyan.auth.controller;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
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
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse httpResponse) {
        authService.logout();
        
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        ApiResponse<Void> response = new ApiResponse<>(true, HttpStatus.OK.value(), "Success", null, LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtProperties.getRefreshExpirationDays() * 24 * 60 * 60)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
