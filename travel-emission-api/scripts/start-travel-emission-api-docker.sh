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

DOCKERNAME="ecoincome-travel-emission-api";
echo "start ecoincome-travel-emission-api";
echo "POSTGRES_HOST: $POSTGRES_HOST"

RUN_ARGS=("--name" "$DOCKERNAME" \
          "--network" "$PRIVATENETWORKNAME" \
          "-e" "POSTGRES_PORT=$POSTGRES_PORT" \
          "-e" "POSTGRES_HOST=$POSTGRES_HOST" \
          "-e" "POSTGRES_USER=$POSTGRES_USER" \
          "-e" "POSTGRES_PASSWORD=$PW" \
          "-e" "PGPASSWORD=$PW" \
          "-e" "POSTGRES_DATABASE=$POSTGRES_DATABASE" \
          "-e" "GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY" \
          "-e" "MODE=$MODE" \
          "-p" "3000:3000" \
          "-d" "guonga/ecoincome-travel-emission-api" )
(docker kill $DOCKERNAME || true) && \
(docker rm $DOCKERNAME || true) && \
(docker run "${RUN_ARGS[@]}")



# docker run \
# --name ecoincome-travel-emission-api \
# --network $PRIVATENETWORKNAME \
# -e POSTGRES_HOST=$POSTGRES_HOST \
# -e POSTGRES_PORT=$POSTGRES_PORT \
# -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
# -e POSTGRES_USER=$POSTGRES_USER \
# -e POSTGRES_DATABASE=$POSTGRES_DATABASE \
# -e GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY \
# -e MODE=$MODE \
# -p 3000:3000 \
# guonga/ecoincome-travel-emission-api
