package com.jankalyan.common.exception;

import com.jankalyan.admin.controller.AdminController;
import com.jankalyan.admin.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.jankalyan.auth.security.JwtTokenProvider jwtTokenProvider;

    @MockBean
    private AdminService adminService;

    @Test
    void handleResourceNotFoundException() throws Exception {
        UUID id = UUID.randomUUID();
        given(adminService.getDashboard()).willThrow(new ResourceNotFoundException("Not found resource"));

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("Not found resource"));
    }

    @Test
    void handleBadRequestException() throws Exception {
        given(adminService.getDashboard()).willThrow(new BadRequestException("Bad request data"));

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Bad request data"));
    }

    @Test
    void handleAccessDeniedException() throws Exception {
        given(adminService.getDashboard()).willThrow(new AccessDeniedException("Access Denied"));

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("ACCESS_DENIED"))
                .andExpect(jsonPath("$.message").value("You don't have permission to access this resource"));
    }

    @Test
    void handleUnexpectedException() throws Exception {
        given(adminService.getDashboard()).willThrow(new RuntimeException("Unexpected runtime error"));

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.errorCode").value("INTERNAL_SERVER_ERROR"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));
    }
}
