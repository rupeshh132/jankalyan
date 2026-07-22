package com.jankalyan.admin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.admin.service.AdminService;
import com.jankalyan.complaint.entity.ComplaintStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import org.mockito.ArgumentCaptor;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.context.annotation.Import;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(com.jankalyan.common.exception.GlobalExceptionHandler.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.jankalyan.auth.security.JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    @Test
    void updateComplaintStatus_ShouldReturn200() throws Exception {
        UUID complaintId = UUID.randomUUID();
        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        request.setStatus(ComplaintStatus.UNDER_REVIEW);

        mockMvc.perform(patch("/api/v1/admin/complaints/{id}/status", complaintId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        ArgumentCaptor<UpdateComplaintStatusRequest> captor = ArgumentCaptor.forClass(UpdateComplaintStatusRequest.class);
        verify(adminService).updateComplaintStatus(eq(complaintId), captor.capture());
        UpdateComplaintStatusRequest captured = captor.getValue();
        assertEquals(ComplaintStatus.UNDER_REVIEW, captured.getStatus());
        
        verifyNoMoreInteractions(adminService);
    }

    @Test
    void updateComplaintStatus_WithMissingStatus_ShouldReturn400() throws Exception {
        UUID complaintId = UUID.randomUUID();
        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        // status is null

        mockMvc.perform(patch("/api/v1/admin/complaints/{id}/status", complaintId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.validationErrors.status").exists());
                
        verifyNoInteractions(adminService);
    }
}
