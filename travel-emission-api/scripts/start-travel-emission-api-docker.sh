#!/bin/bash
set -e

PARENT_DIR="$(dirname "$(realpath "$0")")"
cd "$PARENT_DIR"

# loads environment variables ('-a' > mark as exportable)
set -a            
source ../.env
set +a

if [ -n "$POSTGRES_HOST_PRNET" ]; then
  POSTGRES_HOST=$POSTGRES_HOST_PRNET
fi

echo "start ecoincome-travel-emission-api";
echo "POSTGRES_HOST: $POSTGRES_HOST"
docker run \
--network $PRIVATENETWORKNAME \
-e POSTGRES_HOST=$POSTGRES_HOST \
-e POSTGRES_PORT=$POSTGRES_PORT \
-e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
-e POSTGRES_USER=$POSTGRES_USER \
-e POSTGRES_DATABASE=$POSTGRES_DATABASE \
-e MODE=$MODE \
-p 3000:3000 \
ecoincome-travel-emission-api
