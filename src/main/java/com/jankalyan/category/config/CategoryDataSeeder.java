package com.jankalyan.category.config;

import com.jankalyan.category.entity.Category;
import com.jankalyan.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CategoryDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial categories...");
            
            List<Category> categories = List.of(
                    Category.builder().name("Roads").department("Public Works Department").build(),
                    Category.builder().name("Garbage").department("Sanitation Department").build(),
                    Category.builder().name("Water Supply").department("Water Supply Department").build(),
                    Category.builder().name("Electricity").department("Electricity Board").build(),
                    Category.builder().name("Street Lights").department("Electrical Maintenance").build(),
                    Category.builder().name("Drainage").department("Drainage Department").build(),
                    Category.builder().name("Public Safety").department("Police Department").build(),
                    Category.builder().name("Others").department("Municipal Corporation").build()
            );

            categoryRepository.saveAll(categories);
            log.info("Categories seeded successfully.");
        }
    }
}
