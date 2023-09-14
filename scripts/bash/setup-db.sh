#!/usr/bin/env bash

#----------------------------------------------------------------------------------------------------------------------
# setup the database for development
#----------------------------------------------------------------------------------------------------------------------

source "$(git rev-parse --show-toplevel)/scripts/bash/lib/common.sh"

if [ -z "$DB_URL" ]; then
  echo "DB_URL not found in .env file"
  exit 1
fi

# psql "$DB_URL"

pnpm cli:pg:setup

pnpm cli:pg:schema public.session
pnpm cli:pg:schema public.user

pnpm cli:pg:seed public.user
