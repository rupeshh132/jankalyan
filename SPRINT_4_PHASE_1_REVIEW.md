# Sprint 4 Phase 1 Review (Complaint Foundation)

## 1. Files Created
- `src/main/java/com/jankalyan/complaint/entity/ComplaintStatus.java`
- `src/main/java/com/jankalyan/complaint/entity/Complaint.java`
- `src/main/java/com/jankalyan/complaint/repository/ComplaintRepository.java`
- `src/main/java/com/jankalyan/complaint/dto/request/CreateComplaintRequest.java`
- `src/main/java/com/jankalyan/complaint/dto/response/ComplaintResponse.java`
- `src/main/java/com/jankalyan/complaint/mapper/ComplaintMapper.java`

## 2. Entity Design
The `Complaint` entity was mapped exactly to the frozen `DATABASE_SCHEMA.md`:
- Primary key uses `UUID` generation strategy.
- Uses strict `@ManyToOne(fetch = FetchType.LAZY)` for both `User` and `Category`, linking to `user_id` and `category_id` correctly.
- Stores location precisely using `DECIMAL(10,8)` and `DECIMAL(11,8)` for `latitude` and `longitude`.
- Enforces lengths and constraints on `title`, `description`, `address`, `city`, `state`, `ward`, and `pincode`.
- The `status` field defaults to the `SUBMITTED` enum implicitly as required.
- Implements automated audit logging using `@CreationTimestamp` and `@UpdateTimestamp`.

## 3. Repository Methods
The `ComplaintRepository` extends `JpaRepository<Complaint, UUID>` inheriting foundational CRUD methods (`findById`, `existsById`, `findAll`). It defines exactly two custom queries to support upcoming workflows securely:
- `List<Complaint> findByUserId(UUID userId);`
- `List<Complaint> findByStatus(ComplaintStatus status);`

## 4. DTO Design
- **CreateComplaintRequest**: Acts as the strict ingress boundary containing ONLY data relevant to creation. It encapsulates `Jakarta Validation` annotations ensuring strict enforcement (`@NotNull`, `@NotBlank`, and `@Size`).
- **ComplaintResponse**: Acts as the safe egress boundary designed specifically for public/authorized consumption. It extracts IDs and Names out of nested `Category` and `User` relations to prevent exposing raw nested entities or cyclic structures.

## 5. Mapper Design
- **ComplaintMapper**: Implemented purely as a standard Java `@Component` class using Lombok's builders. It securely bridges the `CreateComplaintRequest` directly to the `Complaint` entity, manually injecting the resolved `User` and `Category` entities passed by the upstream service layer. It seamlessly converts nested relational models into the flattened `ComplaintResponse`.

## 6. Build Output
```
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```
*Note: A minor import discrepancy (User model pathing) was identified and resolved immediately, leading to a flawless build.*

## 7. Compliance Verification
- **Architecture**: Enforces the domain isolation standard flawlessly.
- **Constraints**: No controllers, services, or APIs were built.
- **Exclusions**: Image Upload, Voting, Status History, and Admin functionalities are deliberately excluded from this foundation pass.
- **Validation**: Strict adherence to the `DATABASE_SCHEMA.md` structure.

**STATUS:** PHASE 4.1 COMPLETED. AWAITING REVIEW.
