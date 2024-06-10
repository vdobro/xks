#!/usr/bin/env bash
set -eou pipefail

rm -rf src/main/resources/static
mkdir src/main/resources/static

mvn clean package -DskipTests

source deployment/versions.env

IMAGE_TAG="dobrovolskis/xks:$XKS_VERSION"
LATEST_TAG="dobrovolskis/xks:latest"

docker build -t "$IMAGE_TAG" .
docker tag "$IMAGE_TAG" "$LATEST_TAG"

#docker push "$IMAGE_TAG"
#docker push "$LATEST_TAG"
