package com.jankalyan.config;

import com.jankalyan.admin.controller.AdminController;
import com.jankalyan.admin.service.AdminService;
import com.jankalyan.auth.security.CustomAccessDeniedHandler;
import com.jankalyan.auth.security.JwtAuthenticationEntryPoint;
import com.jankalyan.auth.security.JwtAuthenticationFilter;
import com.jankalyan.auth.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AdminController.class)
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class,
        CustomAccessDeniedHandler.class
})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private AdminService adminService;

    @Test
    void unauthenticatedAccess_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void roleUser_CannotAccessAdmin_ShouldReturn403() throws Exception {
        String token = "valid-user-token";
        Claims claims = org.mockito.Mockito.mock(Claims.class);
        given(claims.getSubject()).willReturn("user@example.com");
        given(claims.get("userId", String.class)).willReturn(UUID.randomUUID().toString());
        given(claims.get("role", String.class)).willReturn("ROLE_USER");

        given(jwtTokenProvider.getClaimsFromToken(token)).willReturn(claims);

        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void roleAdmin_CanAccessAdmin_ShouldReturn200() throws Exception {
        String token = "valid-admin-token";
        Claims claims = org.mockito.Mockito.mock(Claims.class);
        given(claims.getSubject()).willReturn("admin@example.com");
        given(claims.get("userId", String.class)).willReturn(UUID.randomUUID().toString());
        given(claims.get("role", String.class)).willReturn("ROLE_ADMIN");

        given(jwtTokenProvider.getClaimsFromToken(token)).willReturn(claims);

        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void invalidToken_ShouldBeRejected() throws Exception {
        String token = "invalid-token";
        given(jwtTokenProvider.getClaimsFromToken(token)).willThrow(new io.jsonwebtoken.MalformedJwtException("Invalid token"));

        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void expiredToken_ShouldBeRejected() throws Exception {
        String token = "expired-token";
        given(jwtTokenProvider.getClaimsFromToken(token)).willThrow(new io.jsonwebtoken.ExpiredJwtException(null, null, "Expired token"));

        mockMvc.perform(get("/api/v1/admin/dashboard")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }
}
