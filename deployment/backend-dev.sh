#!/usr/bin/env bash
set -eou pipefail

docker compose -p xks --profile "full" -f compose-base.yaml -f compose-local.yaml down --volumes

docker compose -p xks -f compose-base.yaml -f compose-local.yaml up
