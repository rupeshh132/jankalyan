package com.jankalyan.category.service;

import com.jankalyan.category.dto.response.CategoryResponse;
import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(UUID id);
}
