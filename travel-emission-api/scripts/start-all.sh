#!/bin/bash

MODE=DEV
PRIVATENETWORKNAME=PRIVATENETWORKNAME
POSTGRES_HOST_PRNET=172.28.1.1
docker network rm $PRIVATENETWORKNAME
docker network create --subnet=172.28.0.0/16  $PRIVATENETWORKNAME
source start-db.sh
source start-travel-emission-api-docker.sh