#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: analyze.sh <file>" >&2
    exit 1
fi
FILE="$1"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== CSV Analysis: $FILE ==="
echo ""

# Count rows (excluding header)
TOTAL_ROWS=$(tail -n +2 "$FILE" | wc -l | tr -d ' ')
echo "Total rows: $TOTAL_ROWS"

# Count columns
HEADERS=$(head -1 "$FILE")
NUM_COLS=$(echo "$HEADERS" | awk -F',' '{print NF}')
echo "Columns: $NUM_COLS"
echo ""

echo "=== Headers ==="
echo "$HEADERS" | tr ',' '\n' | nl

echo ""
echo "=== First 5 rows ==="
head -6 "$FILE"

echo ""
echo "=== Last 5 rows ==="
tail -5 "$FILE"
