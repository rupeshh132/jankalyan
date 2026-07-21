package com.jankalyan.complainthistory.mapper;

import com.jankalyan.complainthistory.dto.response.ComplaintStatusHistoryResponse;
import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import org.springframework.stereotype.Component;

@Component
public class ComplaintStatusHistoryMapper {

    public ComplaintStatusHistoryResponse toResponse(ComplaintStatusHistory history) {
        if (history == null) {
            return null;
        }

        return ComplaintStatusHistoryResponse.builder()
                .id(history.getId())
                .oldStatus(history.getOldStatus())
                .newStatus(history.getNewStatus())
                .changedById(history.getChangedBy() != null ? history.getChangedBy().getId() : null)
                .createdAt(history.getCreatedAt())
                .build();
    }
}
