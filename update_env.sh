#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Define the .env and .env.example files
ENV_FILE=".env"
EXAMPLE_FILE=".env.example"

# Check if the .env file exists; if not, create it
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${YELLOW}$ENV_FILE does not exist. Creating it from $EXAMPLE_FILE.${NC}"
  cp "$EXAMPLE_FILE" "$ENV_FILE"
  echo -e "${GREEN}$ENV_FILE created with contents from $EXAMPLE_FILE.${NC}"
  exit 0
fi

echo -e "${BLUE}Checking for new variables to add from $EXAMPLE_FILE to $ENV_FILE...${NC}"

# Loop through each line in the .env.example file
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  if [[ "$line" =~ ^# ]] || [[ -z "$line" ]]; then
    continue
  fi

  # Extract variable name and value from the line
  var_name=$(echo "$line" | cut -d '=' -f 1)

  # Check if the variable is already defined in the .env file
  if ! grep -q "^$var_name=" "$ENV_FILE"; then
    # If not, append the variable from .env.example to .env
    echo -e "${GREEN}Adding $var_name to $ENV_FILE${NC}"
    echo "$line" >> "$ENV_FILE"
  else
    echo -e "${YELLOW}Variable $var_name already exists in $ENV_FILE. Skipping.${NC}"
  fi
done < "$EXAMPLE_FILE"

echo -e "${BLUE}Update complete. New variables from $EXAMPLE_FILE have been added to $ENV_FILE.${NC}"
