#!/bin/bash

delete() {
    echo "Deleting resource from $1"
    kubectl delete -f $1
}

files=("fo-combined.yaml" "bo-combined.yaml" "mysql-combined.yaml" "phpmyadmin-combined.yaml")

for file in "${files[@]}"; do
    delete $file
done

echo "Resource deletion complete."
