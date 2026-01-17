#!/bin/bash

# Pre-commit hook to prevent commits on main branch
# Exit code 2 = blocking

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo '{
    "block": true,
    "feedback": "🚫 Cannot commit directly to main branch. Please create a feature branch first.",
    "suppressOutput": false
  }' >&2
  exit 2
fi

exit 0
