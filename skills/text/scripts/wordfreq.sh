#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: wordfreq.sh <file> [--top <n>]" >&2
    exit 1
fi
FILE="$1"
TOP="${3:-20}"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Word Frequency: $FILE ==="
echo ""
# Convert to lowercase, split on non-word chars, count, sort
tr '[:upper:]' '[:lower:]' < "$FILE" \
    | tr -cs '[:alpha:]' '\n' \
    | grep -v '^$' \
    | sort \
    | uniq -c \
    | sort -rn \
    | head -"$TOP" \
    | awk '{ printf "%-6d %s\n", $1, $2 }'
