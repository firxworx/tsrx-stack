#!/usr/bin/env bash

#----------------------------------------------------------------------------------------------------------------------
# Common import to setup project bash scripts including loading and validating environment variables.
#
# usage:
# import common.sh in any bash script housed within the project git repo --
#
# ```
# source "$(git rev-parse --show-toplevel)/scripts/bash/lib/common.sh"
# ```
#----------------------------------------------------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

# debug note:
# add `set -x` to print every command executed by the script

# common variable definitions
SCRIPT_PATH="${BASH_SOURCE[0]}"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
GIT_REPO_ROOT=$(git rev-parse --show-toplevel)

# import the `loadEnv()` to load env files
. "$GIT_REPO_ROOT/scripts/bash/lib/load-env.sh"

# load the .env file in the root of the git repo
loadEnv "$GIT_REPO_ROOT/.env"

# required environment variables (space separated list)
REQUIRED_ENV_VAR_NAMES="DB_URL"

# use bash indirect reference to check for each variable by name
for VN in $REQUIRED_ENV_VAR_NAMES; do
  if [ -z "${!VN}" ]; then
    echo "Error: required environment variable $VN is unset or empty"
    exit 1
  fi
done
