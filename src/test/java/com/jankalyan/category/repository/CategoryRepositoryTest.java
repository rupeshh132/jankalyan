package com.jankalyan.category.repository;

import com.jankalyan.category.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CategoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldReturnTrueWhenCategoryNameExists() {
        Category category = new Category();
        category.setName("Roads");
        category.setDepartment("Test Dept");
        category.setDescription("Road related issues");
        entityManager.persist(category);
        entityManager.flush();

        boolean exists = categoryRepository.existsByName("Roads");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldFindByNameIgnoreCase() {
        Category category = new Category();
        category.setName("Water");
        category.setDepartment("Test Dept");
        category.setDescription("Water related issues");
        entityManager.persist(category);
        entityManager.flush();

        Optional<Category> found = categoryRepository.findByNameIgnoreCase("water");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Water");
    }

    @Test
    void shouldFindAllByOrderByNameAsc() {
        Category c1 = new Category();
        c1.setName("Zebra");
        c1.setDepartment("Test Dept");
        c1.setDescription("Desc");
        
        Category c2 = new Category();
        c2.setName("Apple");
        c2.setDepartment("Test Dept");
        c2.setDescription("Desc");
        
        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.flush();

        List<Category> categories = categoryRepository.findAllByOrderByNameAsc();

        assertThat(categories).hasSize(2);
        assertThat(categories.get(0).getName()).isEqualTo("Apple");
        assertThat(categories.get(1).getName()).isEqualTo("Zebra");
    }
}
