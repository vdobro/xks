#!/usr/bin/env bash
set -eou pipefail

export APPLICATION_HOST="xks.dobrovolskis.com"
export COUCHDB_USERNAME="xks"
export INTERNAL_COUCHDB_URL="http://db:5984"

# if not set, use the default test password
if [ -z ${COUCHDB_PASSWORD+x} ]; then
    export COUCHDB_PASSWORD="Password1234"
fi

docker pull couchdb:3.3
docker pull docker.io/dobrovolskis/xks:0.1-SNAPSHOT

docker compose -p xks -f compose-base.yaml -f compose-production.yaml up -d
