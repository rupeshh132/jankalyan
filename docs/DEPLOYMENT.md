# Jankalyan Deployment Guide

## Architecture
The application uses a containerized three-tier architecture:
- **Frontend**: React SPA served by Nginx (Port 80)
- **Backend**: Spring Boot 3.x (Java 21) exposing REST APIs (Port 8080 internal)
- **Database**: MySQL 8.x (Port 3306 internal)

## Prerequisites
- A remote VPS or Cloud Instance (Ubuntu 22.04 LTS recommended)
- Docker and Docker Compose installed
- SSH access for the CI/CD pipeline

## Environment Setup
1. Clone the repository on your server.
2. Create a `.env` file in the root directory (refer to `.env.example`).
3. Set the variables:
   - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`, `JWT_EXPIRATION`
   - `CLOUDINARY_URL`
   - `SPRING_PROFILES_ACTIVE=prod`

## Deployment Steps (Manual)
Run the following from the project root:
```bash
docker compose up -d --build
```

## CI/CD Pipeline
Deployment is fully automated using GitHub Actions. Upon a push to the `main` branch, the pipeline will securely SSH into the server, pull the latest code, and execute a zero-downtime deployment.
