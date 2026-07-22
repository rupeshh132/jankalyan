package com.jankalyan.complaint.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.service.ComplaintService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import org.mockito.ArgumentCaptor;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.context.annotation.Import;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ComplaintController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(com.jankalyan.common.exception.GlobalExceptionHandler.class)
class ComplaintControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.jankalyan.auth.security.JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ComplaintService complaintService;

    @Test
    void createComplaint_ShouldReturn201() throws Exception {
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setCategoryId(UUID.randomUUID());
        request.setTitle("Pothole issue");
        request.setDescription("Big pothole on main road");

        ComplaintResponse responseData = new ComplaintResponse();
        responseData.setTitle("Pothole issue");

        given(complaintService.createComplaint(any(CreateComplaintRequest.class))).willReturn(responseData);

        mockMvc.perform(post("/api/v1/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.title").value("Pothole issue"));

        ArgumentCaptor<CreateComplaintRequest> captor = ArgumentCaptor.forClass(CreateComplaintRequest.class);
        verify(complaintService).createComplaint(captor.capture());
        CreateComplaintRequest captured = captor.getValue();
        assertEquals("Pothole issue", captured.getTitle());
        assertEquals("Big pothole on main road", captured.getDescription());
        
        verifyNoMoreInteractions(complaintService);
    }

    @Test
    void createComplaint_WithBlankTitle_ShouldReturn400() throws Exception {
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setCategoryId(UUID.randomUUID());
        request.setTitle("");
        request.setDescription("Big pothole on main road");

        mockMvc.perform(post("/api/v1/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.title").exists());
                
        verifyNoInteractions(complaintService);
    }

    @Test
    void getComplaintById_ShouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        ComplaintResponse responseData = new ComplaintResponse();
        responseData.setId(id);

        given(complaintService.getComplaintById(id)).willReturn(responseData);

        mockMvc.perform(get("/api/v1/complaints/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(id.toString()));

        verify(complaintService).getComplaintById(id);
        verifyNoMoreInteractions(complaintService);
    }

    @Test
    void getMyComplaints_ShouldReturn200() throws Exception {
        given(complaintService.getMyComplaints()).willReturn(List.of(new ComplaintResponse()));

        mockMvc.perform(get("/api/v1/complaints/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(complaintService).getMyComplaints();
        verifyNoMoreInteractions(complaintService);
    }

    @Test
    void deleteComplaint_ShouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/complaints/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(complaintService).deleteComplaint(id);
        verifyNoMoreInteractions(complaintService);
    }
}
