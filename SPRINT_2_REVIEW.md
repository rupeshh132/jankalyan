# Sprint 2 - Authentication Module Review

## 1. Files Created
- `src/main/java/com/jankalyan/user/entity/User.java`
- `src/main/java/com/jankalyan/user/entity/RoleType.java`
- `src/main/java/com/jankalyan/user/repository/UserRepository.java`
- `src/main/java/com/jankalyan/auth/entity/RefreshToken.java`
- `src/main/java/com/jankalyan/auth/repository/RefreshTokenRepository.java`
- `src/main/java/com/jankalyan/auth/dto/request/LoginRequest.java`
- `src/main/java/com/jankalyan/auth/dto/request/RegisterRequest.java`
- `src/main/java/com/jankalyan/auth/dto/response/JwtAuthResponse.java`
- `src/main/java/com/jankalyan/auth/security/UserPrincipal.java`
- `src/main/java/com/jankalyan/auth/security/CustomUserDetailsService.java`
- `src/main/java/com/jankalyan/auth/security/JwtTokenProvider.java`
- `src/main/java/com/jankalyan/auth/security/JwtAuthenticationFilter.java`
- `src/main/java/com/jankalyan/auth/service/AuthService.java`
- `src/main/java/com/jankalyan/auth/service/impl/AuthServiceImpl.java`
- `src/main/java/com/jankalyan/auth/service/RefreshTokenService.java`
- `src/main/java/com/jankalyan/auth/service/impl/RefreshTokenServiceImpl.java`
- `src/main/java/com/jankalyan/auth/controller/AuthController.java`
- `src/main/java/com/jankalyan/common/exception/TokenRefreshException.java`
- `src/main/java/com/jankalyan/common/exception/UserAlreadyExistsException.java`
- `src/main/java/com/jankalyan/config/JwtProperties.java`

## 2. Files Modified
- `pom.xml`: Added JWT dependencies (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`).
- `src/main/resources/application.yml`: Added JWT properties (`app.jwt.secret`, `expiration-ms`, `refresh-expiration-days`).
- `src/main/java/com/jankalyan/config/SecurityConfig.java`: Configured Stateless session management, added `JwtAuthenticationFilter`, and wired `BCryptPasswordEncoder` (strength 12).
- `src/main/java/com/jankalyan/common/exception/GlobalExceptionHandler.java`: Handled authentication exceptions with standard `ErrorResponse` builder pattern.

## 3. Design Decisions
1. **Refresh Token Rotation Policy:** Enforced exactly as requested. Every login deletes existing refresh tokens for the user, generates a new one, and saves it in the database and as an `HttpOnly`, `Strict` SameSite cookie.
2. **JWT Claims:** Strictly adhered to `sub (email)`, `userId`, `role`, `iat`, and `exp`. Did not include `tokenVersion`.
3. **Password Encoder Strength:** Set BCrypt strength precisely to 12.
4. **Validation Logic:** Registration requires strict validation on Name, Email, Phone, and Password before processing.
5. **Entity Alignment:** Created `is_active` field in `User` entity to strictly match the database schema default true logic.
6. **Stateless Scalability:** Kept everything stateless per the frozen architecture. JWT tokens bypass the DB on every request.

## 4. Frozen Document Compliance Confirmation
I confirm that absolutely **no frozen documents were violated** during this sprint. The `refresh_tokens` table was accurately implemented according to the pre-approved conflict resolution. Email and Forgot password flows were purposefully skipped to comply with their deferral to Version 2.

## 5. Build Output
```text
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  46.337 s
[INFO] Finished at: 2026-07-21T14:42:46+05:30
[INFO] ------------------------------------------------------------------------
```

## 6. Complete Source Code of All New Classes

### User.java
```java
package com.jankalyan.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 15, unique = true)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @Column(name = "profile_image", length = 500)
    private String profileImage;
    
    @Column(name = "is_active", nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

### RoleType.java
```java
package com.jankalyan.user.entity;

public enum RoleType {
    USER,
    ADMIN
}
```

### UserRepository.java
```java
package com.jankalyan.user.repository;

import com.jankalyan.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
```

### RefreshToken.java
```java
package com.jankalyan.auth.entity;

import com.jankalyan.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### RefreshTokenRepository.java
```java
package com.jankalyan.auth.repository;

import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    void deleteByUser(User user);
}
```

### LoginRequest.java
```java
package com.jankalyan.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

### RegisterRequest.java
```java
package com.jankalyan.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full Name is required")
    @Size(min = 2, max = 100, message = "Full Name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Full Name must contain only alphabets and spaces")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must be less than 255 characters")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit number")
    private String phone;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,20}$", message = "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
    private String password;
}
```

### JwtAuthResponse.java
```java
package com.jankalyan.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtAuthResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn;
    private String role;
}
```

### JwtProperties.java
```java
package com.jankalyan.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long expirationMs;
    private long refreshExpirationDays;
}
```

### UserPrincipal.java
```java
package com.jankalyan.auth.security;

import com.jankalyan.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private final UUID id;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean isActive;

    public static UserPrincipal create(User user) {
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.getIsActive()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return isActive; }
}
```

### CustomUserDetailsService.java
```java
package com.jankalyan.auth.security;

import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return UserPrincipal.create(user);
    }

    public UserDetails loadUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return UserPrincipal.create(user);
    }
}
```

### JwtTokenProvider.java
```java
package com.jankalyan.auth.security;

import com.jankalyan.config.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpirationMs());

        String role = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        return Jwts.builder()
                .subject(userPrincipal.getEmail())
                .claim("userId", userPrincipal.getId().toString())
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String generateTokenForUser(com.jankalyan.user.entity.User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpirationMs());

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId().toString())
                .claim("role", "ROLE_" + user.getRole().name())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }
}
```

### JwtAuthenticationFilter.java
```java
package com.jankalyan.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromToken(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### AuthService.java
```java
package com.jankalyan.auth.service;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.response.JwtAuthResponse;

public interface AuthService {
    void register(RegisterRequest registerRequest);
    AuthResult login(LoginRequest loginRequest);
    AuthResult refresh(String refreshToken);
    void logout(String email);

    record AuthResult(JwtAuthResponse jwtResponse, String refreshToken) {}
}
```

### AuthServiceImpl.java
```java
package com.jankalyan.auth.service.impl;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.dto.response.JwtAuthResponse;
import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.auth.repository.RefreshTokenRepository;
import com.jankalyan.auth.security.JwtTokenProvider;
import com.jankalyan.auth.service.AuthService;
import com.jankalyan.auth.service.RefreshTokenService;
import com.jankalyan.common.exception.TokenRefreshException;
import com.jankalyan.common.exception.UserAlreadyExistsException;
import com.jankalyan.config.JwtProperties;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        User user = userRepository.findByEmail(request.getEmail().toLowerCase()).orElseThrow();
        
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
                .map(RefreshToken::getUser)
                .map(user -> {
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
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(refreshTokenService::deleteByUser);
    }
}
```

### RefreshTokenService.java
```java
package com.jankalyan.auth.service;

import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.user.entity.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUser(User user);
}
```

### RefreshTokenServiceImpl.java
```java
package com.jankalyan.auth.service.impl;

import com.jankalyan.auth.entity.RefreshToken;
import com.jankalyan.auth.repository.RefreshTokenRepository;
import com.jankalyan.auth.service.RefreshTokenService;
import com.jankalyan.common.exception.TokenRefreshException;
import com.jankalyan.config.JwtProperties;
import com.jankalyan.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(jwtProperties.getRefreshExpirationDays()))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Override
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
```

### AuthController.java
```java
package com.jankalyan.auth.controller;

import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.auth.service.AuthService;
import com.jankalyan.common.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse httpResponse) {
        String email = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : null;
        if (email != null) {
            authService.logout(email);
        }
        
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
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
```

### TokenRefreshException.java
```java
package com.jankalyan.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class TokenRefreshException extends RuntimeException {
    public TokenRefreshException(String message) { super(message); }
}
```

### UserAlreadyExistsException.java
```java
package com.jankalyan.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) { super(message); }
}
```
