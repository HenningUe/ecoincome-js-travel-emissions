#!/bin/bash

MODE=DEV
PRIVATENETWORKNAME=PRIVATENETWORKNAME
POSTGRES_HOST_PRNET=172.28.1.1
docker kill $(docker images --filter=reference="*postgres*" -q)
docker kill $(docker images --filter=reference="*ecoincome-travel-emission-api*" -q)
docker network rm $PRIVATENETWORKNAME
docker network create --subnet=172.28.0.0/16  $PRIVATENETWORKNAME
source start-db.sh
source start-travel-emission-api-docker.sh