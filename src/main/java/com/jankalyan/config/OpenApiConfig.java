package com.jankalyan.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI jankalyanOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Jankalyan API")
                        .description("API Documentation for Jankalyan Civic Issue Reporting Platform")
                        .version("v1.0"));
    }
}
