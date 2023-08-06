#!/usr/bin/env bash
set -eou pipefail

rm -rf src/main/resources/static
mkdir src/main/resources/static

mvn clean package -DskipTests

docker build -t dobrovolskis/xks:0.1-SNAPSHOT .
docker push dobrovolskis/xks:0.1-SNAPSHOT
docker tag dobrovolskis/xks:0.1-SNAPSHOT dobrovolskis/xks:latest
docker push dobrovolskis/xks:latest
