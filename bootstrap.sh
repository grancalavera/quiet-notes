#!/usr/bin/env bash

DEFAULT_ADMIN=admin@example.com

if [ "$1" = "--defaults" ]; then
  ADMIN_EMAIL="$DEFAULT_ADMIN"
  echo "using default admin ${DEFAULT_ADMIN}"
else
  echo "admin email? (default: ${DEFAULT_ADMIN})"
  read ADMIN_EMAIL
  if [ -z "$ADMIN_EMAIL" ]; then
    ADMIN_EMAIL="$DEFAULT_ADMIN"
  fi
fi
echo "building..."

echo "DEFAULT_ADMIN=${ADMIN_EMAIL}" > ./quiet-notes-functions-dist/.env

pnpm --filter 'quiet-notes-tools' write-env
