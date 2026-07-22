package com.jankalyan.auth.service.impl;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.auth.repository.RefreshTokenRepository;
import com.jankalyan.auth.security.JwtTokenProvider;
import com.jankalyan.auth.service.AuthService;
import com.jankalyan.auth.service.RefreshTokenService;
import com.jankalyan.common.exception.UserAlreadyExistsException;
import com.jankalyan.config.JwtProperties;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.jankalyan.auth.security.UserPrincipal;
import com.jankalyan.common.exception.TokenRefreshException;
import java.util.Collections;
import java.util.UUID;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private RefreshTokenService refreshTokenService;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private JwtProperties jwtProperties;
    @Mock private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldRegisterSuccessfully() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@test.com");
        request.setPhone("1234567890");
        request.setPassword("password");

        given(userRepository.existsByEmail(anyString())).willReturn(false);
        given(userRepository.existsByPhone(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("encoded_password");

        authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        
        User capturedUser = userCaptor.getValue();
        assertThat(capturedUser.getEmail()).isEqualTo("test@test.com");
        assertThat(capturedUser.getFullName()).isEqualTo("Test User");
        assertThat(capturedUser.getPhone()).isEqualTo("1234567890");
        assertThat(capturedUser.getPasswordHash()).isEqualTo("encoded_password");
        assertThat(capturedUser.getRole()).isEqualTo(RoleType.USER);
    }

    @Test
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");

        given(userRepository.existsByEmail("test@test.com")).willReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    void shouldThrowWhenPhoneAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPhone("1234567890");

        given(userRepository.existsByEmail(anyString())).willReturn(false);
        given(userRepository.existsByPhone("1234567890")).willReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("Phone number already exists");
    }

    @Test
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        User user = User.builder().email("test@test.com").role(RoleType.USER).build();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh_token_123");

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).willReturn(authentication);
        given(jwtTokenProvider.generateToken(authentication)).willReturn("jwt_token_123");
        given(userRepository.findByEmail("test@test.com")).willReturn(Optional.of(user));
        given(refreshTokenService.createRefreshToken(user)).willReturn(refreshToken);
        given(jwtProperties.getExpirationMs()).willReturn(3600000L);

        AuthService.AuthResult result = authService.login(request);

        assertThat(result.jwtResponse().getAccessToken()).isEqualTo("jwt_token_123");
        assertThat(result.refreshToken()).isEqualTo("refresh_token_123");
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isEqualTo(authentication);
    }

    @Test
    void shouldThrowOnInvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("wrong");

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void shouldRefreshSuccessfully() {
        String oldToken = "old_refresh_token";
        RefreshToken oldRefreshToken = new RefreshToken();
        User user = User.builder().email("test@test.com").role(RoleType.USER).build();
        oldRefreshToken.setUser(user);

        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setToken("new_refresh_token");

        given(refreshTokenRepository.findByToken(oldToken)).willReturn(Optional.of(oldRefreshToken));
        given(refreshTokenService.verifyExpiration(oldRefreshToken)).willReturn(oldRefreshToken);
        given(refreshTokenService.createRefreshToken(user)).willReturn(newRefreshToken);
        given(jwtTokenProvider.generateTokenForUser(user)).willReturn("new_jwt_token");
        given(jwtProperties.getExpirationMs()).willReturn(3600000L);

        AuthService.AuthResult result = authService.refresh(oldToken);

        assertThat(result.jwtResponse().getAccessToken()).isEqualTo("new_jwt_token");
        assertThat(result.refreshToken()).isEqualTo("new_refresh_token");
    }

    @Test
    void shouldThrowWhenRefreshTokenNotFound() {
        String token = "invalid_token";
        given(refreshTokenRepository.findByToken(token)).willReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh(token))
                .isInstanceOf(TokenRefreshException.class)
                .hasMessageContaining("Refresh token is invalid or not in database");
    }

    @Test
    void shouldThrowWhenRefreshTokenExpired() {
        String token = "expired_token";
        RefreshToken refreshToken = new RefreshToken();
        
        given(refreshTokenRepository.findByToken(token)).willReturn(Optional.of(refreshToken));
        given(refreshTokenService.verifyExpiration(refreshToken))
                .willThrow(new TokenRefreshException("Refresh token was expired"));

        assertThatThrownBy(() -> authService.refresh(token))
                .isInstanceOf(TokenRefreshException.class)
                .hasMessageContaining("expired");
    }

    @Test
    void shouldLogoutSuccessfully() {
        UUID userId = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(userId, "test@test.com", "pass", Collections.emptyList(), true);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        authService.logout();

        verify(refreshTokenService).deleteByUserId(userId);
    }

    @Test
    void shouldNotFailLogoutIfUnauthenticated() {
        SecurityContextHolder.clearContext();

        authService.logout();

        verify(refreshTokenService, org.mockito.Mockito.never()).deleteByUserId(any());
    }
}
