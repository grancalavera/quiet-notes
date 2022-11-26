#!/usr/bin/env bash

echo "default admin email:"
read ADMIN_EMAIL
firebase functions:config:set quiet_notes.default_admin="$ADMIN_EMAIL"

RUNTIME_CONFIG=$(firebase functions:config:get)
echo "${RUNTIME_CONFIG}" > ./quiet-notes-functions-dist/.runtimeconfig.json
echo "${RUNTIME_CONFIG}"

pnpm --filter 'quiet-notes-tools' write-env-local
