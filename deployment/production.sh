#!/usr/bin/env bash
set -eou pipefail

export APPLICATION_HOST="xks.dobrovolskis.com"
export COUCHDB_USERNAME="xks"

# if not set, use the default test password
if [ -z ${COUCHDB_PASSWORD+x} ]; then
    export COUCHDB_PASSWORD="Password1234"
fi

docker compose -p xks -f compose-base.yaml -f compose-development.yaml up
