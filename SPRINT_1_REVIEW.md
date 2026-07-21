# SPRINT 1 REVIEW

## 1. Project Tree (Newly Created Files)

```text
jankalyan/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── jankalyan/
│       │           ├── common/
│       │           │   ├── constant/
│       │           │   │   └── AppConstants.java
│       │           │   ├── dto/
│       │           │   │   ├── ApiResponse.java
│       │           │   │   └── ErrorResponse.java
│       │           │   ├── exception/
│       │           │   │   ├── BadRequestException.java
│       │           │   │   ├── GlobalExceptionHandler.java
│       │           │   │   └── ResourceNotFoundException.java
│       │           │   └── util/
│       │           │       ├── DateTimeUtils.java
│       │           │       ├── StringUtils.java
│       │           │       └── ValidationUtils.java
│       │           └── config/
│       │               └── WebConfig.java
│       └── resources/
│           ├── application.yml
│           └── logback-spring.xml
```

## 2. Complete Source Code

### `ApiResponse.java`
```java
package com.jankalyan.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private int status;
    private String message;
    private T data;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
```

### `ErrorResponse.java`
```java
package com.jankalyan.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private int status;
    private String error;
    private String errorCode;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}
```

### `GlobalExceptionHandler.java`
```java
package com.jankalyan.common.exception;

import com.jankalyan.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .errorCode("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .errorCode("BAD_REQUEST")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .errorCode("VALIDATION_ERROR")
                .message("Input validation failed")
                .path(request.getRequestURI())
                .validationErrors(errors)
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .errorCode("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred")
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### `WebConfig.java`
```java
package com.jankalyan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Specifically configure this in environments
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 3. `application.yml`
```yaml
spring:
  profiles:
    active: dev
  application:
    name: jankalyan

logging:
  level:
    root: INFO
    com.jankalyan: DEBUG
  file:
    name: logs/jankalyan.log
```

## 4. `logback-spring.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml" />
    <include resource="org/springframework/boot/logging/logback/console-appender.xml" />

    <property name="LOG_FILE" value="${LOG_FILE:-logs/jankalyan.log}"/>

    <!-- File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- daily rollover -->
            <fileNamePattern>logs/jankalyan.%d{yyyy-MM-dd}.log</fileNamePattern>
            <!-- keep 30 days' worth of history -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${FILE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Profiles -->
    <springProfile name="dev">
        <root level="INFO">
            <appender-ref ref="CONSOLE" />
        </root>
        <logger name="com.jankalyan" level="DEBUG" />
    </springProfile>

    <springProfile name="prod">
        <root level="INFO">
            <appender-ref ref="CONSOLE" />
            <appender-ref ref="FILE" />
        </root>
        <logger name="com.jankalyan" level="INFO" />
    </springProfile>
    
    <springProfile name="test">
        <root level="INFO">
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>
</configuration>
```

## 5. Design Decisions
- **`ApiResponse`**: Designed with Java Generics (`<T>`) so it can wrap any payload across all future feature modules (Users, Complaints, etc.). Lombok's `@Builder` simplifies instantiation. The explicit `status` field was added per architectural guidelines.
- **`ErrorResponse`**: Incorporates standard HTTP details and a specific `errorCode` field designed for robust frontend error matching. We utilized `@JsonInclude(JsonInclude.Include.NON_NULL)` to omit null fields from the JSON payload (like `validationErrors` when no validation constraints were violated), keeping the payload clean.
- **`GlobalExceptionHandler`**: Built using `@RestControllerAdvice` to centralize all exception handling logic. This eliminates boilerplate `try-catch` blocks across Controllers. It automatically translates constraint violations (`MethodArgumentNotValidException`) into a readable `validationErrors` map, meeting our validation architecture requirements.
- **`WebConfig`**: Implements `WebMvcConfigurer` to establish cross-origin resource sharing (CORS) rules globally, rather than using `@CrossOrigin` annotations on individual controllers.

## 6. Known Limitations
- The `WebConfig` CORS policy currently uses `allowedOriginPatterns("*")`. While perfectly suited for development, this should be locked down to specific frontend domains (e.g., via environment variables) when moving to production to prevent cross-origin exploitation.
- The `GlobalExceptionHandler` currently relies on a generic `Exception.class` catch-all for unexpected failures (Internal Server Errors). As business logic expands, more granular handlers (e.g., `DataIntegrityViolationException`, `AccessDeniedException`) will need to be added to gracefully map database or security errors to the client.

## 7. Compliance Confirmation
I confirm that **no frozen architecture, API specification, database schema, folder structure, or business rules were modified**. All changes were strictly additive to establish the foundational common package logic as specified.
