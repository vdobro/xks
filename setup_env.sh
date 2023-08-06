#!/bin/sh
if [ -z "$INTERNAL_COUCHDB_URL" ]
then
  echo "\$INTERNAL_COUCHDB_URL must not be empty and must be defined as a valid URL of a running CouchDB instance."
  exit
fi
if [ -z "$EXTERNAL_COUCHDB_URL" ]
then
  echo "\$EXTERNAL_COUCHDB_URL must not be empty and must be defined as a valid URL of a running CouchDB instance."
  exit
fi
if [ -z "$COUCHDB_USERNAME" ]
then
  echo "\$DB_USERNAME must not be empty."
  exit
fi
if [ -z "$COUCHDB_PASSWORD" ]
then
  echo "\$COUCHDB_PASSWORD must not be empty."
  exit
fi
if [ -z "$APPLICATION_HOST" ]
then
  echo "\$APPLICATION_HOST must not be empty and be a valid URL of this application instance without the 'https://' prefix."
  exit
fi
envsubst < /application/BOOT-INF/classes/static/assets/env.template.js > /application/BOOT-INF/classes/static/assets/env.js
java org.springframework.boot.loader.JarLauncher
