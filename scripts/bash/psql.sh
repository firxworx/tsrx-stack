#!/usr/bin/env bash

#----------------------------------------------------------------------------------------------------------------------
# connect to database using psql client using DB_URL connection string from the project .env file
#----------------------------------------------------------------------------------------------------------------------

source "$(git rev-parse --show-toplevel)/scripts/bash/lib/common.sh"

if [ -z "$DB_URL" ]; then
  echo "DB_URL not found in .env file"
  exit 1
fi

psql "$DB_URL"
