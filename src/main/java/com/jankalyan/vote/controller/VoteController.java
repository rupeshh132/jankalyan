package com.jankalyan.vote.controller;

import com.jankalyan.common.dto.ApiResponse;
import com.jankalyan.vote.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@Tag(name = "Voting", description = "Complaint voting APIs")
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/{complaintId}/vote")
    @Operation(summary = "Vote for a complaint", description = "Adds a vote from the authenticated user to the specified complaint.")
    public ResponseEntity<ApiResponse<Void>> addVote(@PathVariable UUID complaintId) {
        voteService.addVote(complaintId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<Void>builder()
                        .success(true)
                        .status(HttpStatus.CREATED.value())
                        .message("Vote recorded successfully")
                        .build()
        );
    }

    @DeleteMapping("/{complaintId}/vote")
    @Operation(summary = "Remove vote from a complaint", description = "Removes the authenticated user's vote from the specified complaint.")
    public ResponseEntity<ApiResponse<Void>> removeVote(@PathVariable UUID complaintId) {
        voteService.removeVote(complaintId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Vote removed successfully")
                        .build()
        );
    }

    @GetMapping("/{complaintId}/vote-count")
    @Operation(summary = "Get vote count for a complaint", description = "Retrieves the total number of votes for the specified complaint.")
    public ResponseEntity<ApiResponse<Long>> getVoteCount(@PathVariable UUID complaintId) {
        long count = voteService.getVoteCount(complaintId);
        return ResponseEntity.ok(
                ApiResponse.<Long>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Vote count retrieved successfully")
                        .data(count)
                        .build()
        );
    }
}
