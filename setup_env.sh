#!/bin/sh
if [ -z "$DB_URL" ]
then
  echo "\$DB_URL must not be empty and must be defined as a valid URL of a running CouchDB instance."
  exit
fi
if [ -z "$DB_USERNAME" ]
then
  echo "\$DB_USERNAME must not be empty."
  exit
fi
if [ -z "$DB_PASSWORD" ]
then
  echo "\$DB_PASSWORD must not be empty."
  exit
fi
if [ -z "$XKS_HOST" ]
then
  echo "\$XKS_HOST must not be empty and be a valid URL of this application instance."
  exit
fi
envsubst < /BOOT-INF/classes/static/assets/env.template.js > /BOOT-INF/classes/static/assets/env.js
java org.springframework.boot.loader.JarLauncher
