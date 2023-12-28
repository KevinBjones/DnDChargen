#!/bin/bash

source .env
DATE=$(date +%Y%m%d_%H%M%S)
POD_NAME=$(kubectl get pod -l $POD_LABEL -n $NAMESPACE -o jsonpath="{.items[0].metadata.name}")
kubectl exec $POD_NAME -n $NAMESPACE -- /usr/bin/mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
