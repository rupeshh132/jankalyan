# Jankalyan Runbook

## Overview
This runbook provides actionable instructions for common operational tasks and troubleshooting scenarios for the Jankalyan platform.

## Common Operations

### 1. View Application Logs
To view the logs of the backend container:
```bash
docker logs jankalyan-backend --tail 100 -f
```

### 2. Restart a Service
If a service is misbehaving (e.g., the frontend):
```bash
docker compose restart frontend
```

### 3. Check Service Health
```bash
docker compose ps
```
Look for `(healthy)` under the STATUS column for `jankalyan-backend` and `jankalyan-db`.

### 4. Database Access
To connect directly to the MySQL database for debugging:
```bash
docker exec -it jankalyan-db mysql -u jankalyan_user -p jankalyan_db
```

## Troubleshooting

### Scenario A: Application Returns 502 Bad Gateway
- **Cause**: Nginx is running, but the Spring Boot backend is down.
- **Action**: Check backend logs using `docker logs jankalyan-backend`. Restart backend if necessary.

### Scenario B: Database Connection Refused
- **Cause**: Database crashed or didn't initialize correctly.
- **Action**: Verify the DB container is healthy. Ensure `.env` database credentials match exactly what Spring Boot expects.

### Scenario C: High CPU Usage
- **Action**: Run `docker stats` to identify the offending container. Check application logs for infinite loops or heavy processing tasks. Scale vertically if necessary.
