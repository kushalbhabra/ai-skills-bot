#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: sort.sh <file> <column_number> [asc|desc]" >&2
    exit 1
fi
FILE="$1"
COL="$2"
ORDER="${3:-asc}"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Sorted by column $COL ($ORDER) ==="
HEADER=$(head -1 "$FILE")
echo "$HEADER"
if [ "$ORDER" = "desc" ]; then
    tail -n +2 "$FILE" | sort -t',' -k"${COL},${COL}" -r
else
    tail -n +2 "$FILE" | sort -t',' -k"${COL},${COL}"
fi
