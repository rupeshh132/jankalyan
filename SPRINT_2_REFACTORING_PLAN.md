# Sprint 2 Refactoring Plan

## 1. Critical Issues

### 1.1 JWT Filter Database Bottleneck
- **Root Cause**: The JWT filter extracts only the email from the token and calls `loadUserByUsername`, which performs a database `SELECT` query on every authenticated request, violating JWT statelessness.
- **Proposed Solution**: Parse `userId`, `email`, and `role` directly from the JWT claims in `JwtTokenProvider`, instantiate the `UserPrincipal` dynamically in memory, and set it in the `SecurityContext` without querying the database.
- **Files Modified**: `JwtAuthenticationFilter.java`, `JwtTokenProvider.java`
- **Frozen Document Impact**: None. (Implementation detail change only, fully compliant).
- **Migration Risk**: Low. No database or API changes.
- **Testing Required**: Test protected endpoints to ensure authentication succeeds without a database hit.

### 1.2 Missing Filter-Level Exception Handling
- **Root Cause**: Spring Security exceptions in filters (`AuthenticationException` and `AccessDeniedException`) are handled by default Spring boot handlers because they bypass the `@RestControllerAdvice` global handler.
- **Proposed Solution**: Create a custom `JwtAuthenticationEntryPoint` and `CustomAccessDeniedHandler`. Register them in `SecurityConfig`. Use an `ObjectMapper` to serialize the standard `ErrorResponse` directly to the `HttpServletResponse` output stream.
- **Files Modified**: `SecurityConfig.java`, `JwtAuthenticationEntryPoint.java` (New), `CustomAccessDeniedHandler.java` (New).
- **Frozen Document Impact**: None. (Ensures API Specification compliance for error responses).
- **Migration Risk**: Medium. Security configuration changes require careful testing of public and protected routes.
- **Testing Required**: Attempt to access protected routes without a token, with an invalid token, and with an expired token. Verify the exact JSON response matches the `ErrorResponse` contract.

## 2. High Issues

### 2.1 Hardcoded Magic Numbers in Cookie Configuration
- **Root Cause**: `AuthController` hardcodes `7 * 24 * 60 * 60` for the refresh token cookie max-age instead of using the central configuration property.
- **Proposed Solution**: Inject `JwtProperties` into `AuthController` and calculate the `maxAge` dynamically: `jwtProperties.getRefreshExpirationDays() * 24 * 60 * 60`.
- **Files Modified**: `AuthController.java`
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Verify the `Set-Cookie` header in the login response correctly sets the `Max-Age` matching the `application.yml` value.

### 2.2 Unnecessary Database Read on Logout
- **Root Cause**: The `logout` method fetches the `User` entity from the DB to pass to the delete function because `RefreshTokenService` accepts a `User` parameter.
- **Proposed Solution**: Modify `RefreshTokenService` to accept a `UUID userId`. Extract the `userId` directly from the `UserPrincipal` (already in memory) and perform a direct delete using a custom JPQL query.
- **Files Modified**: `AuthService.java`, `AuthServiceImpl.java`, `AuthController.java`, `RefreshTokenService.java`, `RefreshTokenServiceImpl.java`, `RefreshTokenRepository.java`.
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Perform a logout operation and verify the token is deleted from the database without triggering a `SELECT` query for the user.

### 2.3 Exception Masking in Token Validation
- **Root Cause**: `validateToken` catches `ExpiredJwtException` and other JWT errors, logs them, and returns `false`, causing a generic 401 response instead of a specific error code.
- **Proposed Solution**: Allow `validateToken` to throw specific `JwtException` errors. Catch them inside the `JwtAuthenticationFilter` and delegate the exception to the `JwtAuthenticationEntryPoint` to return a `TOKEN_EXPIRED` or `INVALID_TOKEN` JSON response.
- **Files Modified**: `JwtTokenProvider.java`, `JwtAuthenticationFilter.java`
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Test API access with a manually expired JWT and assert the returned JSON contains the `TOKEN_EXPIRED` error code.

## 3. Medium Issues

### 3.1 N+1 and Inefficient Delete Query
- **Root Cause**: The derived Spring Data JPA query `deleteByUser(User user)` fetches entities first and then deletes them individually.
- **Proposed Solution**: Write a custom `@Modifying` JPQL query: `@Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId") void deleteByUserId(@Param("userId") UUID userId);`.
- **Files Modified**: `RefreshTokenRepository.java`, `RefreshTokenServiceImpl.java`.
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Verify the logout flow and new login flow correctly clear previous refresh tokens with exactly one `DELETE` SQL statement.

### 3.2 Unhandled Edge Case Resulting in 500 Error
- **Root Cause**: Using `.orElseThrow()` without arguments on an `Optional<User>` inside `login()` throws a generic `NoSuchElementException`.
- **Proposed Solution**: Use `.orElseThrow(() -> new UsernameNotFoundException("User not found"))` to ensure the error maps gracefully to a 401 via existing security handlers.
- **Files Modified**: `AuthServiceImpl.java`.
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Verify the build succeeds (functional test for this edge case is logical).

## 4. Low Issues

### 3.3 Primitive vs Object Wrapper for Booleans
- **Root Cause**: `private Boolean isActive` uses the object wrapper class instead of a primitive, introducing unnecessary nullability.
- **Proposed Solution**: Change to `private boolean isActive = true;` and update `UserPrincipal` constructor logic if necessary.
- **Files Modified**: `User.java`, `UserPrincipal.java`
- **Frozen Document Impact**: None.
- **Migration Risk**: Low.
- **Testing Required**: Rebuild the project to ensure no compile-time errors due to getter signature changes (`isActive()` instead of `getIsActive()`).

---

## Estimated Implementation Order

1. **Entity & Primitive Fixes**: (Low Risk) Fix `isActive` boolean.
2. **Repository Optimizations**: (Medium Risk) Implement `@Modifying` bulk delete by `userId`.
3. **Service Logic Refactoring**: (Medium Risk) Fix the 500 error edge case, update `logout` to avoid DB reads, and refactor cookie configuration.
4. **JWT Provider & Filter Overhaul**: (High Risk) Refactor `JwtTokenProvider` to throw exceptions and parse claims fully. Update `JwtAuthenticationFilter` to create `UserPrincipal` statelessly.
5. **Security Configuration & Exception Handlers**: (High Risk) Create and register `JwtAuthenticationEntryPoint` and `CustomAccessDeniedHandler`.
