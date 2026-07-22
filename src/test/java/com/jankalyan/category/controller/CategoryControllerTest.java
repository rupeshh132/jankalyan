package com.jankalyan.category.controller;

import com.jankalyan.category.dto.response.CategoryResponse;
import com.jankalyan.category.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.jankalyan.auth.security.JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CategoryService categoryService;

    @Test
    void getAllCategories_ShouldReturn200() throws Exception {
        given(categoryService.getAllCategories()).willReturn(List.of(CategoryResponse.builder().name("Test Category").build()));

        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(categoryService).getAllCategories();
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    void getCategoryById_ShouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        given(categoryService.getCategoryById(id)).willReturn(CategoryResponse.builder().id(id).name("Test Category").build());

        mockMvc.perform(get("/api/v1/categories/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(id.toString()));

        verify(categoryService).getCategoryById(id);
        verifyNoMoreInteractions(categoryService);
    }
}
