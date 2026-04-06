#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: filter.sh <file> <column_number> <value>" >&2
    exit 1
fi
FILE="$1"
COL="$2"
VALUE="$3"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Filtered rows (column $COL = '$VALUE') ==="
# Print header
head -1 "$FILE"
# Filter rows
awk -F',' -v col="$COL" -v val="$VALUE" 'NR>1 && $col==val' "$FILE"
