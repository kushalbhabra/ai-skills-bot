#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: select.sh <file> <col1> <col2> ..." >&2
    exit 1
fi
FILE="$1"
shift
COLS="$@"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Selected columns: $COLS ==="
awk -F',' -v OFS=',' "{ print $(echo "$COLS" | sed 's/ /,\$/g; s/^/\$/') }" "$FILE"
