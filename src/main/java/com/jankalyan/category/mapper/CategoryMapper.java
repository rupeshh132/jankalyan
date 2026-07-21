package com.jankalyan.category.mapper;

import com.jankalyan.category.dto.response.CategoryResponse;
import com.jankalyan.category.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    
    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .department(category.getDepartment())
                .build();
    }
}
