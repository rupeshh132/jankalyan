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

### Phase 13.1 - Complaint Edit API (Lifecycle Management)
- **Complaint Update API**: Exposes `PUT /api/v1/complaints/{id}` using `UpdateComplaintRequest` payload for textual edits.
- **Ownership Validation**: Validates `principal.getId()` against `complaint.getUser().getId()` before permitting any updates or image deletions, throwing `AccessDeniedException` (403) on mismatches.
- **Anonymous Complaint Support**: Adds `isAnonymous` boolean to the `Complaint` entity, conditionally omitting UI representation of the user identity without destroying the underlying `userId` relational mapping.

### Phase 13.2 - Admin Complaint Management
- **Admin Security Architecture**: `AdminController` endpoints are strictly protected by `@PreAuthorize("hasRole('ADMIN')")`, returning 403 Forbidden for `ROLE_USER` or 401 Unauthorized for unauthenticated clients.
- **Specification Pattern & EntityGraph Optimization**: `ComplaintSpecification.getAdminComplaints()` seamlessly combines `AND`/`OR` logic on a single SQL query. To mitigate N+1 query faults on paginated responses and detailed queries, `@EntityGraph` annotations are aggressively utilized across `ComplaintRepository` and `ComplaintStatusHistoryRepository` to fetch eager joins like User, Category, and changedBy mappings.
- **Status Transition Matrix**: Encapsulates rigid workflow logic within `AdminServiceImpl`, systematically blocking invalid status progressions (e.g., `RESOLVED` -> `SUBMITTED`) and returning 400 Bad Request.
- **Internal Admin Notes Architecture**: Admin `remarks` are persisted exclusively in the `ComplaintStatusHistory` table mapped to `changedBy`, ensuring they are strictly decoupled from the public `ComplaintResponse` DTO.
- **Complaint Timeline Architecture**: Timeline endpoints pull chronologically ordered records representing granular, immutable history slices of status mutations coupled with the administrative context.

### Phase 13.3 - Admin Dashboard & Analytics
- **Analytics Aggregation Strategy**: Eliminates N+1 frontend requests by collapsing all statistical computations into a singular, highly optimized `AdminDashboardResponse` payload. Native SQL scaling prevents memory overflow during large table scans.
- **Monthly Trend Generation**: Implements a native MySQL `WITH RECURSIVE` Common Table Expression (CTE) to procedurally generate a guaranteed 12-month timeline, preserving mathematical continuity by securely projecting `0` counts for absent months instead of dropping vectors.
- **Category Aggregation**: Mandates an explicit `LEFT JOIN` initialized from the root `Category` entity downwards to the `Complaint` association matrix. This guarantees all active departments reflect on the dashboard regardless of zero-complaint activity statuses.
- **Performance Constraints**: Operations demanding complex temporal calculations (e.g., `AVG(TIMESTAMPDIFF)`) are strictly resolved on the database cluster mapping directly to Java Primitives, bypassing JVM object instantiation penalties.

### Phase 14.1 - Authentication Security Hardening
- **Refresh Token Rotation**: Explicitly couples refresh calls to a `delete(oldToken)` contract. A consumed refresh token is instantly purged from MySQL before a fresh token pair is yielded, mathematically eliminating Replay Attack lifespans without triggering mass logouts across adjacent user sessions.
- **Stateless Architecture**: Access Tokens operate entirely statelessly via JWT validation in the `JwtAuthenticationFilter`, while Refresh tokens are heavily constrained to `HttpOnly`, `Secure`, and `SameSite` constraints mitigating XSS extraction vectors.

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

### Phase 13.1 - Edit State Management
- **Image Management Workflow**: The frontend operates in an integrated hybrid mode; it uses `DELETE /api/v1/complaints/images/{imageId}` to synchronously remove existing images in real-time, and batches new images in a separate `POST /api/v1/complaints/{id}/images` request following a successful text update.
- **React Query Cache Invalidation**: The `useUpdateComplaint` hook forcibly invalidates both the `['complaints']` collection and the `['complaint', id]` record upon successful mutation, instantly synchronizing global app state.

### Phase 13.2 - Admin Complaint Management
- **URL-based Single Source of Truth**: The `ComplaintManagementPage.jsx` refactors `useState` hooks to `useSearchParams`. By synchronizing `page`, `search`, `status`, `categoryId`, and `sort` perfectly to the browser URL, filtering behaves immutably and works flawlessly with the History API (Back/Forward).
- **Admin Workflow Integrity**: `ComplaintStatusModal.jsx` computes a valid dropdown subset preventing users from firing out-of-order `useUpdateComplaintStatus` mutations natively in the UI.
- **Accessibility Enhancements (A11y)**: Focus Trap mechanics loop `Tab`/`Shift+Tab` bindings strictly within the active dialog, `ESC` bindings unmount the modal, and WAI-ARIA markers (`role="dialog"`, `aria-modal="true"`) secure robust screen reader compatibility.
- **Role-Aware Mutations**: `useDeleteComplaint.js` cleanly forks execution logic based on `{ id, isAdmin: true }`, ensuring destructive admin calls route through `adminApi.js` vs `complaintApi.js`.

### Phase 13.3 - Admin Dashboard & Analytics
- **Dashboard Component Architecture**: Incorporates an enterprise SaaS CSS Grid topology (`grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))`) permitting natural component reflows natively without complex Javascript media-query listeners.
- **React Query Caching Strategy**: Employs global query invalidation targeting `['adminDashboardStats']` anytime `useUpdateComplaintStatus` intercepts a status mutation. This effortlessly forces the Dashboard view into absolute real-time synchronization without prop-drilling or Context triggers.
- **Performance Notes**: The inclusion of `recharts` pushed the bundled javascript chunk above the 500kB Vite warning threshold. A Backlog item has been created to split the charting dependencies via `React.lazy()` during a future optimization sprint.

### Phase 14.1 - Authentication Security Hardening
- **Memory-only Authentication State**: Integrates access tokens directly into standard React Context state and functional closures within `axiosInstance.js`. By strictly avoiding `localStorage` or `sessionStorage`, all XSS exposure is systematically closed.
- **Silent Hydration**: Introduces an implicit `api.post('/auth/refresh')` cascade during application mount to restore user state globally via the HttpOnly cookie without disruptive visual flickers.
- **Axios Token Interceptor Flow**: The 401 interceptor dynamically resolves backend API wrappers (`ApiResponse`) to securely pull transient access tokens into the configuration header, subsequently resolving infinite network loops.
- **BroadcastChannel Synchronicity**: Distributes stateless cross-tab `'LOGOUT'` payloads globally to sibling origins. When a user explicitly terminates their session on Tab A, Tab B securely mounts an immediate internal purge and forces `/login` simultaneously.
- **Memory Purge**: Explicit implementations of `queryClient.clear()` ensures that highly sensitive administrative payloads are ripped from DOM memory the exact millisecond a session expires.

## Security Architecture

### Phase 14.1 - OWASP Hardening
- **XSS Mitigation**: The total eradication of `localStorage` ensures that executed malicious JS injections cannot extract authentication tokens.
- **Replay Attack Mitigation**: Enforced backend token rotation mathematically truncates stolen refresh token validity the exact moment they are re-used maliciously or legitimately.
- **Secure Lifecycle Constraints**: All session lifecycle states are highly governed, enforcing stringent JWT Expiration blocks and automated, sweeping closures.

## Phase 14.2 - Notification & Communication System Architecture

### Backend Architecture
- **Generic Notification framework:** Designed to support STATUS_UPDATE, RESOLUTION, REJECTION, GENERAL, and SYSTEM_ALERT. Notifications are completely decoupled from Complaints via eferenceId and ctionUrl.
- **Notification Entity design:** Tracks UUID, user reference, title, message, type, boolean ead status, read timestamps, and actionable URLs.
- **Event-driven architecture using Spring Application Events:** Decoupled business logic where AdminServiceImpl pushes NotificationEvent instances asynchronously using ApplicationEventPublisher.
- **@TransactionalEventListener(AFTER_COMMIT):** Ensures notifications are only processed and saved to the database AFTER the parent complaint status transaction commits successfully.
- **REQUIRES_NEW transaction isolation:** Provides an isolated transaction context for the notification listener to prevent database rollbacks of core complaint updates if notification persistence fails.
- **SSE architecture:** Standard W3C Server-Sent Events architecture for unidirectional push notifications.
- **Multi-tab emitter management using Map<UUID, CopyOnWriteArrayList<SseEmitter>>:** Fully supports users opening multiple browser tabs simultaneously. Detached, timed-out, or completed emitters are efficiently garbage collected.
- **JwtAuthenticationFilter support for SSE token authentication via ?token=:** Restricts token URL parameter processing exclusively to /stream endpoints to satisfy the JS EventSource lack of Authorization header support, while maintaining strict zero-trust security on standard endpoints.
- **Notification security model:** Complete cross-user contamination prevention. Resources strictly validate userId ownership prior to mutation (e.g. markAsRead).
- **Notification API architecture:** Paginated history list (GET /notifications), Unread Count (GET /notifications/unread-count), Mark As Read (PUT /notifications/{id}/read), Mark All As Read (PUT /notifications/read-all), Stream (GET /notifications/stream).

### Frontend Architecture
- **NotificationBell architecture:** A dynamic React component rendering absolute positioned badges and conditionally mounted dropdown elements.
- **Notifications page architecture:** A full, paginated view mapping distinct Tailwind SVG icons to NotificationType payloads.
- **TanStack React Query integration:** Consumes the Notification REST endpoints and stores the dataset in browser memory using the ['notifications'] query key.
- **SSE lifecycle management:** Encapsulated in the useNotifications.js React custom hook to manage EventSource opening, message ingestion, and memory closure.
- **Cache invalidation strategy:** Real-time messages trigger instantaneous queryClient.invalidateQueries(['notifications']) sweeps, causing the entire UI tree to safely re-synchronize without complex local mutation code.
- **Real-time synchronization:** Pushed payloads map natively to React Query.
- **Badge synchronization:** Derived mathematically from the unreadCount REST endpoint and updated automatically by Query invalidations.
- **Dropdown architecture:** Controlled via useRef outside-click hooks to elegantly dismiss overlapping UI elements.

## Phase 14.3.1 - Enterprise Design System Foundation

### Frontend Architecture
- **Tailwind CSS v3.4 foundation:** Utilizing v3.4 for 100% compatibility with shadcn/ui. Includes a highly optimized config supporting 8-point spacing, strict semantic color variables, and comprehensive container constraints.
- **shadcn/ui configuration:** Configured using standard components.json utilizing CSS variables over arbitrary raw colors.
- **Standardized html.dark theme architecture:** Unified strategy leveraging Tailwind's `darkMode: 'class'`. The `ThemeContext` injects the `.dark` class explicitly onto `document.documentElement`, fully replacing the legacy `data-theme` approach.
- **Inter typography system:** Production-grade font loading via Google Fonts `<link rel="preconnect">` for zero layout shifting.
- **Semantic color token architecture:** HSL values mapped to distinct CSS variables in `global.css` representing primary, secondary, accent, destructive, success, and background UI semantics.
- **PostCSS pipeline:** Executing `tailwindcss` and `autoprefixer` efficiently via Vite.
- **Framer Motion foundation:** Installed to orchestrate complex page transitions and micro-interactions in future UI updates.
- **Utility library (cn):** Established `src/lib/utils.js` using `clsx` and `tailwind-merge` to securely compute conditional utility classes without runtime conflicts.

## Phase 14.3.2 - Enterprise UI Component Library

### Frontend Component Architecture
- **Enterprise UI Component Library:** Fully decoupled, robust shadcn-based presentation layer existing exclusively in rontend/src/components/ui/.
- **CVA variant architecture:** Uses class-variance-authority across elements (Buttons, Badges, Alerts) to map semantic states (destructive, default, outline) into precise Tailwind composites securely without string concatenation conflicts.
- **Radix UI integration:** Uses @radix-ui/react-slot for Button polymorphic rendering, @radix-ui/react-label for WCAG accessible labels, and @radix-ui/react-separator for structural dividers.
- **Accessibility improvements:** Deeply embedded WCAG AA compliance. Focus rings (ocus-visible), Aria-invalid semantic targeting, and Icon-button screen reader safeguards.
- **Loading-state abstraction:** The Button primitive universally accepts an isLoading prop, elegantly transitioning into an inline Spinner, blocking interactions via disabled, and preventing layout shift.
- **Error-state abstraction:** Form primitives (Input, Textarea) react dynamically to a custom error prop or ria-invalid='true' to instantly inject unified destructive border and focus rings.
- **Semantic Alert system:** Alerts dynamically map contextual variants to precise lucide-react icons (e.g. Warning -> AlertTriangle) ensuring rigorous visual consistency.
- **Dark mode compatibility:** Entire component suite is perfectly bound to the global CSS variables. Components dynamically adjust via g-card or g-background tokens with absolute zero component-level dark: overrides needed.