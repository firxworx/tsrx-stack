#!/usr/bin/env bash

#----------------------------------------------------------------------------------------------------------------------
# Define `loadEnv()` to load an env file at the provided path and exports as variables in the bash environment
#
# usage:  `loadEnv /path/to/.env`
#
# notes:
# - default path is '.env' if no argument is provided
# - variables that reference other variables are not expanded
# - if expansion is required consider redefining them in the calling script or using `eval`
#----------------------------------------------------------------------------------------------------------------------

loadEnv() {
  # set the path as first argument or use default
  local envFile="${1:-.env}"

  # read file line by line
  while read -r line || [[ -n "$line" ]]; do
    # split line into a key-value pair
    IFS='=' read -r key value <<< "$line"

    # trim leading and trailing whitespace from the key and value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # export the key-value pair as an exported variable in the bash environment
    export "$key=$value"

    # add eval to treat args as bash commands and expand vars (~accuracy) `eval "export \"$key=$value\""``
  done < <(grep -vE '^#|^[[:space:]]*$' "$envFile")
}
