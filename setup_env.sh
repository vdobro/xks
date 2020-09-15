#!/bin/sh
if [ -z "$DB_URL" ]
then
  echo "\$DB_URL must not be empty and must be defined as a URL with a trailing slash to a running CouchDB instance."
  exit
fi
if [ -z "$DB_ADMIN_PASSWORD" ]
then
  echo "\$DB_ADMIN_PASSWORD must not be empty."
  exit
fi
envsubst < /BOOT-INF/classes/static/assets/env.template.js > /BOOT-INF/classes/static/assets/env.js
java org.springframework.boot.loader.JarLauncher