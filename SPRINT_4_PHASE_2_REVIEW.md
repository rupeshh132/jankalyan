# Sprint 4 Phase 2 Review (Complaint Service Layer)

## 1. Files Created
- `src/main/java/com/jankalyan/complaint/service/ComplaintService.java`
- `src/main/java/com/jankalyan/complaint/service/impl/ComplaintServiceImpl.java`

*Note: Additionally, `ComplaintRepository.java` was slightly augmented securely within standard JPA specs to include `findByUserIdAndIsDeletedFalse` to satisfy the explicit requirement for retrieving non-deleted complaints natively at the database level.*

## 2. Business Logic Implemented
Strictly implemented the four core operations requested without implementing any forbidden features (no controllers, APIs, image uploads, voting, or admin features):
- **Create Complaint**: Securely pulls `UserPrincipal` from the `SecurityContext`. Asserts the user and category exist, binds them to the new Complaint, hardcodes `status = SUBMITTED` and `isDeleted = false`, persists it, and returns the public DTO.
- **Get Complaint By Id**: Simple direct fetch enforcing strict standard DB mapping.
- **Get My Complaints**: Resolves the authenticated user, delegates filtering of soft-deleted entries natively down to the DB (`findByUserIdAndIsDeletedFalse`), and cascades the mapping for a clean list of DTOs.
- **Soft Delete Complaint**: Rigorously evaluates ownership matching and status constraints (`SUBMITTED` only). Transitions `isDeleted` to `true` strictly inside memory and saves the updated entity.

## 3. Transaction Strategy
- The `ComplaintServiceImpl` class is marked strictly with `@Transactional(readOnly = true)`.
- Write-heavy or state-mutating operations (`createComplaint()` and `deleteComplaint()`) actively override this with `@Transactional` natively. This guarantees ACID compliance specifically on mutative actions while ensuring high-performance lock-free fetches on reads.

## 4. Security Rules
- Fully relies on native stateless `SecurityContextHolder` configurations built in Sprint 2.
- Hardcoded ownership validation is enforced natively within `deleteComplaint()`. If the acting user attempting the soft delete is not the original owner (matched against the entity's mapped user UUID), an `AccessDeniedException` is immediately thrown.

## 5. Exception Strategy
- `ResourceNotFoundException`: Leveraged intelligently across failed entity DB hits (e.g., Missing User, Missing Category, Missing Complaint) with explicitly tailored error messages dynamically resolving standard HTTP 404 in the previously built GlobalHandler.
- `AccessDeniedException`: Fired to cleanly map unauthorized ownership deletions to HTTP 403 endpoints.
- `IllegalStateException`: Cast defensively upon attempts to softly delete a complaint that has already progressed past `SUBMITTED` status.

## 6. Build Output
```
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

## 7. Architecture Review
The codebase maintains robust Clean Architecture boundaries. 
- Controllers and presentation layers remain entirely untouched.
- Services safely orchestrate DTO generation shielding entities entirely.
- DB calls remain streamlined without generating an N+1 threat footprint on eagerly fetched mappings.

**STATUS**: PHASE 4.2 COMPLETED. STANDING BY FOR REVIEW.
