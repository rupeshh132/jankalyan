package com.jankalyan.auth.service.impl;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.response.JwtAuthResponse;
import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.auth.repository.RefreshTokenRepository;
import com.jankalyan.auth.security.JwtTokenProvider;
import com.jankalyan.auth.service.AuthService;
import com.jankalyan.auth.service.EmailService;
import com.jankalyan.auth.service.OtpService;
import com.jankalyan.auth.service.RefreshTokenService;
import com.jankalyan.common.exception.TokenRefreshException;
import com.jankalyan.common.exception.UserAlreadyExistsException;
import com.jankalyan.config.JwtProperties;
import com.jankalyan.user.entity.AuthProvider;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final EmailService emailService;
    private final OtpService otpService;

    @Value("${google.client-id:}")
    private String googleClientId;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("Phone number already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.USER)
                .isActive(true)
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public AuthResult login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        JwtAuthResponse response = JwtAuthResponse.builder()
                .accessToken(jwt)
                .expiresIn(jwtProperties.getExpirationMs() / 1000)
                .role(user.getRole().name())
                .build();

        return new AuthResult(response, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResult googleLogin(com.jankalyan.auth.dto.request.GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(java.util.Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                throw new com.jankalyan.common.exception.BadRequestException("Invalid Google ID Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject();

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = User.builder()
                        .fullName(name)
                        .email(email)
                        .authProvider(AuthProvider.GOOGLE)
                        .googleId(googleId)
                        .role(RoleType.USER)
                        .isActive(true)
                        .build();
                user = userRepository.save(user);
            } else if (user.getAuthProvider() == AuthProvider.LOCAL) {
                // Link Google account to local account
                user.setAuthProvider(AuthProvider.GOOGLE);
                user.setGoogleId(googleId);
                userRepository.save(user);
            }

            return createAuthResultForUser(user);
        } catch (Exception e) {
            throw new com.jankalyan.common.exception.BadRequestException("Google authentication failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void sendOtp(com.jankalyan.auth.dto.request.SendOtpRequest request) {
        // We look up user by phone number to find their registered email
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new com.jankalyan.common.exception.ResourceNotFoundException("No user found with this phone number"));

        String otp = otpService.generateAndSaveOtp(user.getEmail());
        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public AuthResult verifyOtpLogin(com.jankalyan.auth.dto.request.VerifyOtpRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new com.jankalyan.common.exception.ResourceNotFoundException("No user found with this phone number"));

        otpService.validateOtp(user.getEmail(), request.getOtpCode());

        return createAuthResultForUser(user);
    }

    private AuthResult createAuthResultForUser(User user) {
        String jwt = jwtTokenProvider.generateTokenForUser(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        JwtAuthResponse response = JwtAuthResponse.builder()
                .accessToken(jwt)
                .expiresIn(jwtProperties.getExpirationMs() / 1000)
                .role(user.getRole().name())
                .build();

        return new AuthResult(response, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResult refresh(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(refreshTokenService::verifyExpiration)
                .map(oldToken -> {
                    User user = oldToken.getUser();
                    // refreshTokenService.delete(oldToken); // Removed: createRefreshToken already deletes all old tokens for this user via JPQL
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
                    String jwt = jwtTokenProvider.generateTokenForUser(user);
                    JwtAuthResponse response = JwtAuthResponse.builder()
                            .accessToken(jwt)
                            .expiresIn(jwtProperties.getExpirationMs() / 1000)
                            .role(user.getRole().name())
                            .build();
                    return new AuthResult(response, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new TokenRefreshException("Refresh token is invalid or not in database!"));
    }

    @Override
    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof com.jankalyan.auth.security.UserPrincipal principal) {
            refreshTokenService.deleteByUserId(principal.getId());
        }
    }
}
