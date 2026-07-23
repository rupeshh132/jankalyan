# JanKalyan: Development Challenges & Solutions Log

This document serves as a historical record of the major technical hurdles encountered during the development of the JanKalyan project and the strategies employed to resolve them. This knowledge base ensures future maintainers can understand the architectural decisions and debugging processes.

---

## 1. Backend: The "Double-Delete" Token Bug (HTTP 500 Error)

### The Problem
During the implementation of the JWT authentication system, specifically the `/api/v1/auth/refresh` endpoint, users experienced an intermittent `500 Internal Server Error` when their browser attempted to refresh an expired access token.

### Root Cause Analysis
The issue stemmed from how Hibernate managed the persistence context inside the `AuthServiceImpl.java`. The code was configured to:
1. Fetch the existing `RefreshToken` associated with the user.
2. Delete the token using a custom JPQL query (`refreshTokenRepository.deleteByUser(user)`).
3. Generate and save a new `RefreshToken`.

However, because the `oldToken` entity was already loaded into the Hibernate Session (Persistence Context), deleting it via a direct JPQL query bypassed Hibernate's entity lifecycle management. When the transaction attempted to commit and flush, Hibernate detected a conflict (a managed entity was suddenly missing from the database), resulting in a `ConcurrentModificationException` / `StaleStateException`.

### The Solution
We refactored the token rotation logic to work seamlessly with Hibernate's lifecycle:
Instead of fetching the token and then running a custom JPQL `DELETE` query, we utilized Spring Data JPA's built-in entity deletion method. We fetched the token entity and passed it directly to `refreshTokenRepository.delete(oldToken)`. This allowed Hibernate to track the deletion within its persistence context, successfully resolving the 500 error.

---

## 2. Frontend: The "Blank Dashboard" Rendering Crash

### The Problem
After successfully logging in, citizens were redirected to the `/dashboard`, but instead of seeing the Complaint Feed, the entire screen was completely blank (white screen). No React error boundary was triggered visibly in the standard console output.

### Root Cause Analysis
The dashboard relies on the `usePublicComplaints` React Query hook, which fetches data from the backend. The Spring Boot backend correctly returned a paginated response wrapped in a standard `ApiResponse` format. 
However, the `ComplaintList.jsx` component incorrectly assumed the data was double-nested. It attempted to extract the array using:
```javascript
const responseData = data?.data;
const content = responseData.content;
```
Because our `complaintApi.js` interceptor was already unwrapping the initial `ApiResponse`, `data` was already the Page object. Therefore, `data.data` evaluated to `undefined`. This caused `content` to fall back to an empty array `[]`, triggering the `<EmptyState />` component. Concurrently, a Vite HMR (Hot Module Replacement) syntax error during UI styling phases exacerbated the issue, causing the blank screen.

### The Solution
We corrected the data parsing logic in `ComplaintList.jsx` to respect the unwrapped payload:
```javascript
// data is already the payload (Page object or Array) because complaintApi unwraps ApiResponse.
const responseData = data;
const isPage = responseData && responseData.content !== undefined;
const content = isPage ? responseData.content : (Array.isArray(responseData) ? responseData : []);
```
This restored the data flow, allowing the Dashboard to render the complaints correctly.

---

## 3. Configuration: Vite Proxy & Port Conflicts

### The Problem
During rapid development cycles, the frontend Vite server would frequently throw `502 Bad Gateway` errors, or complain that port `5173` was already in use, starting on `5174` instead.

### Root Cause Analysis
- **Port Conflicts:** Previous instances of the Vite server were not being terminated gracefully when the terminal was closed or restarted, leaving zombie Node.js processes holding onto port 5173.
- **502 Bad Gateway:** The Vite proxy (`server.proxy` in `vite.config.js`) was configured to forward `/api` requests to `http://localhost:8080`. When the Spring Boot backend was halted for compilation or crashed due to the Token Bug, the proxy failed to connect, resulting in a 502 error on the frontend.

### The Solution
We implemented a strict process management routine. Before restarting the backend or frontend, we actively identified and terminated lingering Java and Node processes using OS-level commands (e.g., PowerShell `Stop-Process`). This ensured clean ports and re-established the proxy connection, eliminating the phantom 502 errors.

---

*Document finalized prior to project Code Freeze.*
