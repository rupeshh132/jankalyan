# Jankalyan Disaster Recovery Plan

## Objective
To ensure rapid restoration of the Jankalyan platform in the event of catastrophic data loss, server failure, or severe corruption.

## 1. Backup Strategy
- **Database**: A daily cron job must be configured on the host machine to execute a logical backup using `mysqldump`.
- **Retention**: Backups must be retained for at least 30 days.
- **Off-site Storage**: Backup archives should be synced automatically to a secure external storage bucket (e.g., AWS S3, Google Cloud Storage) to protect against physical host failure.

### Manual Backup Command
```bash
docker exec jankalyan-db /usr/bin/mysqldump -u jankalyan_user -p<password> jankalyan_db > backup_$(date +%F).sql
```

## 2. Restoration Process

### Scenario: Complete Server Loss
1. Provision a new VPS or Cloud Instance.
2. Clone the Jankalyan repository from GitHub.
3. Re-create the `.env` file using securely backed-up secrets.
4. Execute `docker compose up -d` to spin up the infrastructure.
5. Wait for the `jankalyan-db` container to become healthy.
6. Copy the latest SQL backup into the DB container:
   ```bash
   docker cp backup.sql jankalyan-db:/backup.sql
   ```
7. Restore the database:
   ```bash
   docker exec -i jankalyan-db mysql -u jankalyan_user -p<password> jankalyan_db < /backup.sql
   ```
8. Restart the backend container to ensure Hibernate connects properly to the restored schema.
   ```bash
   docker compose restart backend
   ```

## 3. High Availability Strategy
Currently, Jankalyan operates as a monolith on a single node. For higher availability in the future, consider migrating the database to a Managed Database Service (RDS/Cloud SQL) and placing multiple backend containers behind a load balancer.
