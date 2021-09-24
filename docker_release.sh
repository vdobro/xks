#!/bin/sh

rm -rf src/main/resources/static
mkdir src/main/resources/static

mvn clean package

docker build -t dobrovolskis/xks:0.1-SNAPSHOT .
docker push dobrovolskis/xks:0.1-SNAPSHOT
