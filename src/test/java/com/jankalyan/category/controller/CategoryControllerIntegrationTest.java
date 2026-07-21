package com.jankalyan.category.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jankalyan.category.entity.Category;
import com.jankalyan.category.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CategoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setup() {
        // Categories are seeded by CategoryDataSeeder via CommandLineRunner
    }

    @Test
    void testGetAllCategories() throws Exception {
        mockMvc.perform(get("/api/v1/categories")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.status", is(200)))
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.data", hasSize(8))) // We seeded exactly 8
                .andExpect(jsonPath("$.data[0].name", notNullValue()))
                .andExpect(jsonPath("$.data[0].department", notNullValue()));
    }

    @Test
    void testGetCategoryById() throws Exception {
        // Fetch one category to get its ID
        Category category = categoryRepository.findAllByOrderByNameAsc().get(0);

        mockMvc.perform(get("/api/v1/categories/{id}", category.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.status", is(200)))
                .andExpect(jsonPath("$.data.id", is(category.getId().toString())))
                .andExpect(jsonPath("$.data.name", is(category.getName())))
                .andExpect(jsonPath("$.data.department", is(category.getDepartment())));
    }

    @Test
    void testGetCategoryByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/categories/{id}", java.util.UUID.randomUUID())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode", is("RESOURCE_NOT_FOUND")))
                .andExpect(jsonPath("$.status", is(404)));
    }
}
