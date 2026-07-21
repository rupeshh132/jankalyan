package com.jankalyan.vote.service;

import java.util.UUID;

public interface VoteService {
    void addVote(UUID complaintId);
    void removeVote(UUID complaintId);
    long getVoteCount(UUID complaintId);
}
