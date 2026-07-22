package com.jankalyan.category.service.impl;

import com.jankalyan.category.dto.response.CategoryResponse;
import com.jankalyan.category.entity.Category;
import com.jankalyan.category.mapper.CategoryMapper;
import com.jankalyan.category.repository.CategoryRepository;
import com.jankalyan.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    void shouldGetAllCategories() {
        Category category = new Category();
        CategoryResponse response = CategoryResponse.builder().id(UUID.randomUUID()).name("Test").department("Dept").build();

        given(categoryRepository.findAllByOrderByNameAsc()).willReturn(List.of(category));
        given(categoryMapper.toResponse(category)).willReturn(response);

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(response);
    }

    @Test
    void shouldGetCategoryById() {
        UUID id = UUID.randomUUID();
        Category category = new Category();
        CategoryResponse response = CategoryResponse.builder().id(id).name("Test").department("Dept").build();

        given(categoryRepository.findById(id)).willReturn(Optional.of(category));
        given(categoryMapper.toResponse(category)).willReturn(response);

        CategoryResponse result = categoryService.getCategoryById(id);

        assertThat(result).isEqualTo(response);
    }

    @Test
    void shouldThrowWhenCategoryNotFound() {
        UUID id = UUID.randomUUID();
        given(categoryRepository.findById(id)).willReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
