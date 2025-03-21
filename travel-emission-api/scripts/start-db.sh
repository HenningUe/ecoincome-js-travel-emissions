#!/bin/bash
set -e

PARENT_DIR="$(dirname "$(realpath "$0")")"
cd "$PARENT_DIR"

# loads environment variables ('-a' > mark as exportable)
if [ -f ../.env ]; then
  set -a            
  source ../.env
  set +a
fi

SERVER="emissions_database_server";
PW="$POSTGRES_PASSWORD";
DB="$POSTGRES_DATABASE";

#NETWARG=--network TESTNETWORK

# -d detached > running in the background
# -v map container directory to persistent local directory
RUN_ARGS=("--name" "$SERVER" \
          "-e" "POSTGRES_PASSWORD=$PW" \
          "-e" "PGPASSWORD=$PW" \
          "-p" "5432:5432" \
          "-d" "postgres" \
          )

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
(docker run "${RUN_ARGS[@]}")
  # -v ${PWD}/postgres-docker:/var/lib/postgresql/data

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
sleep 4;

# create the db 
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres

if [ -n "$PRIVATENETWORKNAME" ]; then
  docker network connect --ip $POSTGRES_HOST_PRNET $PRIVATENETWORKNAME $SERVER 
  echo "running in $PRIVATENETWORKNAME"
fi