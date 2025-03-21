#!/bin/bash

#!/bin/bash

MODE=DEV
PRIVATENETWORKNAME=PRIVATENETWORKNAME
POSTGRES_HOST_PRNET=172.28.1.1

docker pull guonga/ecoincome-travel-emission-api:latest
source start-db.sh
source start-travel-emission-api-docker.sh