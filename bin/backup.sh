BACKUP_DIR="/var/dnd/mysql/backup"
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="dnd"
CONTAINER_NAME="dnd-mysql"
docker exec $CONTAINER_NAME /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
