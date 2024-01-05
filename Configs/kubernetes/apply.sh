#!/bin/bash


apply() {
    echo "Applying configuration from $1"
    kubectl apply -f $1
}

files=("fo-combined.yaml" "bo-combined.yaml" "mysql-combined.yaml" "phpmyadmin-combined.yaml")

for file in "${files[@]}"; do
    apply $file
done

echo "Configuration application complete."
