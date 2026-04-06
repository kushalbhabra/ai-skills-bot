#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: search.sh <file> <pattern>" >&2
    exit 1
fi
FILE="$1"
PATTERN="$2"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Search results for '$PATTERN' in $FILE ==="
MATCHES=$(grep -n "$PATTERN" "$FILE" 2>/dev/null)
if [ -z "$MATCHES" ]; then
    echo "No matches found."
else
    echo "$MATCHES"
    echo ""
    COUNT=$(echo "$MATCHES" | wc -l | tr -d ' ')
    echo "Total matches: $COUNT"
fi
