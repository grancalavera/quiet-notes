#!/usr/bin/env bash

DEFAULT_ADMIN=admin@example.com

echo "default admin email:(${DEFAULT_ADMIN})"
read ADMIN_EMAIL
if [ -z "$ADMIN_EMAIL" ]; then
  ADMIN_EMAIL="admin@example.com"
fi

firebase functions:config:set quiet_notes.default_admin="$ADMIN_EMAIL"

RUNTIME_CONFIG=$(firebase functions:config:get)
echo "${RUNTIME_CONFIG}" > ./quiet-notes-functions-dist/.runtimeconfig.json
echo "${RUNTIME_CONFIG}"

pnpm --filter 'quiet-notes-tools' write-env
