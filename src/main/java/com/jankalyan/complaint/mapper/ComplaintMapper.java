package com.jankalyan.complaint.mapper;

import com.jankalyan.user.entity.User;
import com.jankalyan.category.entity.Category;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.dto.response.ComplaintResponse;
import com.jankalyan.complaint.entity.Complaint;
import org.springframework.stereotype.Component;

@Component
public class ComplaintMapper {

    public Complaint toEntity(CreateComplaintRequest request, User user, Category category) {
        if (request == null) {
            return null;
        }

        return Complaint.builder()
                .user(user)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .ward(request.getWard())
                .pincode(request.getPincode())
                .isAnonymous(request.isAnonymous())
                // status is initialized to SUBMITTED by default through builder logic
                .build();
    }

    public ComplaintResponse toResponse(Complaint complaint) {
        if (complaint == null) {
            return null;
        }

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .userId(complaint.getUser() != null ? complaint.getUser().getId() : null)
                .categoryId(complaint.getCategory() != null ? complaint.getCategory().getId() : null)
                .categoryName(complaint.getCategory() != null ? complaint.getCategory().getName() : null)
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .address(complaint.getAddress())
                .city(complaint.getCity())
                .state(complaint.getState())
                .ward(complaint.getWard())
                .pincode(complaint.getPincode())
                .status(complaint.getStatus())
                .isAnonymous(complaint.isAnonymous())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(com.jankalyan.complaint.dto.request.UpdateComplaintRequest request, Complaint complaint, Category category) {
        if (request == null || complaint == null) {
            return;
        }

        if (category != null) {
            complaint.setCategory(category);
        }
        
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setAddress(request.getAddress());
        complaint.setCity(request.getCity());
        complaint.setState(request.getState());
        complaint.setWard(request.getWard());
        complaint.setPincode(request.getPincode());
        complaint.setAnonymous(request.isAnonymous());
    }
}
