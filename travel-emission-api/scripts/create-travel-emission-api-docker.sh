#!/bin/bash
set -e

PARENT_PARENT_DIR="$(dirname "$(dirname "$(realpath "$0")")")"
cd "$PARENT_PARENT_DIR"

docker build -t ecoincome-travel-emission-api .