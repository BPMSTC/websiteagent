#!/bin/bash

# Post-install hook to verify environment setup after package.json changes
# Exit code 0 = success, 1 = non-blocking warning

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"

# Only run if package.json was modified
if [[ "$FILE_PATH" == *"package.json" ]]; then
  echo '{
    "feedback": "📦 package.json was modified. Dependencies may need updating. Run `npm install` if needed.",
    "suppressOutput": false
  }' >&2
fi

# Check if .env file exists and has required keys
if [ ! -f ".env" ]; then
  echo '{
    "feedback": "⚠️  No .env file found. Copy .env.example to .env and add your API keys.",
    "suppressOutput": false
  }' >&2
  exit 1
fi

exit 0
