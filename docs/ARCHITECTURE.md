# Jankalyan Architecture

## Backend Architecture

### Core Technologies
- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- MySQL
- JWT Authentication

### Phase 12.3 - Dynamic Querying (Public Complaint Discovery)
To support robust, optional, and combined filtering without creating a Cartesian explosion of repository methods, the application uses **JpaSpecificationExecutor**.
- `ComplaintSpecification.java`: Dynamically builds Criteria API predicates based on provided query parameters (`search`, `categoryId`, `status`).
- **N+1 Optimization**: Uses `root.fetch("category", JoinType.LEFT)` when the query is not a `COUNT` query, ensuring that pagination remains performant and avoids repeated `SELECT` statements for nested relationships.
- **Error Handling**: `GlobalExceptionHandler.java` catches `MethodArgumentTypeMismatchException` to prevent 500 errors when invalid UUIDs or Enums are passed via URL query strings, gracefully mapping them to 400 Bad Request.

## Frontend Architecture

### Core Technologies
- React 18
- Vite
- React Router DOM
- TanStack React Query

### Phase 12.3 - State Management (Public Complaint Discovery)
The Discovery Page (`PublicComplaintsPage.jsx`) implements a **Single Source of Truth (SSOT)** architecture relying entirely on URL Search Parameters.
- `useSearchParams` acts as the definitive state for `page`, `sort`, `categoryId`, and `status`.
- This ensures native browser Back/Forward navigation flawlessly restores complex filter states without custom history management.
- `useDebounce` limits the rate of search API requests.
- `keepPreviousData: true` is utilized within `useQuery` to retain the current list visually while fetching the next page/filter result, preventing jarring "flicker" and white screens.
- **Lazy Loading**: `<img>` tags on heavily repeated elements like `ComplaintCard` utilize native `loading="lazy"` to optimize Time to Interactive (TTI) and bandwidth usage.
