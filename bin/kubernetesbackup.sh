#!/bin/bash

source /var/dnd/bin/.env

DATE=$(date +%Y%m%d_%H%M%S)

POD_NAME=$(kubectl get pod -l $POD_LABEL -n $NAMESPACE -o jsonpath="{.items[0].metadata.name}")
if [ $? -ne 0 ]; then
    echo "Failed to get POD_NAME" >&2
    exit 1
fi

kubectl exec $POD_NAME -n $NAMESPACE -- /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD --all-databases > $BACKUP_DIR/db_backup_complete_$DATE.sql
if [ $? -ne 0 ]; then
    echo "Database backup command failed for all databases" >&2
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

BINARY_LOG_DIR="/var/lib/mysql" 
BINARY_LOG_BACKUP_DIR="$BACKUP_DIR/binary_logs_$DATE"
mkdir -p $BINARY_LOG_BACKUP_DIR
kubectl cp $NAMESPACE/$POD_NAME:$BINARY_LOG_DIR $BINARY_LOG_BACKUP_DIR
if [ $? -ne 0 ]; then
    echo "Binary log backup command failed" >&2
    exit 1
fi
