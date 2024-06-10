#!/usr/bin/env bash
set -eou pipefail

set -a
source versions.env
set +a

export APPLICATION_HOST="xks.dobrovolskis.com"
export COUCHDB_USERNAME="xks"
export INTERNAL_COUCHDB_URL="http://db:5984"

# if not set, use the default test environment password
if [ -z ${COUCHDB_PASSWORD+x} ]; then
    echo "WARNING: COUCHDB_PASSWORD is not set. Using the default password."
    export COUCHDB_PASSWORD="Password1234"
fi

docker pull "couchdb:${COUCHDB_VERSION}"
docker pull "docker.io/dobrovolskis/xks:${XKS_VERSION}"

docker compose -p xks -f compose-base.yaml -f compose-production.yaml up -d
