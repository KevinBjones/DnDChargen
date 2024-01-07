#!/bin/bash

source /var/dnd/bin/.env

DATE=$(date +%Y%m%d_%H%M%S)

POD_NAME=$(kubectl get pod -l $POD_LABEL -n $NAMESPACE -o jsonpath="{.items[0].metadata.name}")
if [ $? -ne 0 ]; then
    echo "Failed to get POD_NAME" >&2
    exit 1
fi

kubectl exec $POD_NAME -n $NAMESPACE -- /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_complete_$DATE.sql
if [ $? -ne 0 ]; then
    echo "Database backup command failed" >&2
    exit 1
fi

kubectl exec $POD_NAME -n $NAMESPACE -- /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_dnd_$DATE.sql
if [ $? -ne 0 ]; then
    echo "Database backup command failed" >&2
    exit 1
fi

kubectl exec $POD_NAME -n $NAMESPACE -- /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD mysql user db > $BACKUP_DIR/db_backup_users$DATE.sql
if [ $? -ne 0 ]; then
    echo "User backup command failed" >&2
    exit 1
fi
