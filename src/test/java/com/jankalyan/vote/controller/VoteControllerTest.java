package com.jankalyan.vote.controller;

import com.jankalyan.vote.service.VoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = VoteController.class)
@AutoConfigureMockMvc(addFilters = false)
class VoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.jankalyan.auth.security.JwtTokenProvider jwtTokenProvider;

    @MockBean
    private VoteService voteService;

    @Test
    void addVote_ShouldReturn200() throws Exception {
        UUID complaintId = UUID.randomUUID();

        mockMvc.perform(post("/api/v1/complaints/{complaintId}/vote", complaintId))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Vote recorded successfully"));

        verify(voteService).addVote(complaintId);
        verifyNoMoreInteractions(voteService);
    }

    @Test
    void getVoteCount_ShouldReturn200() throws Exception {
        UUID complaintId = UUID.randomUUID();
        given(voteService.getVoteCount(complaintId)).willReturn(10L);

        mockMvc.perform(get("/api/v1/complaints/{complaintId}/vote-count", complaintId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(10));

        verify(voteService).getVoteCount(complaintId);
        verifyNoMoreInteractions(voteService);
    }
}
