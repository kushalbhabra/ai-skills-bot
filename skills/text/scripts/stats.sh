#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: stats.sh <file>" >&2
    exit 1
fi
FILE="$1"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

echo "=== Text Statistics: $FILE ==="
echo ""
echo "Lines:      $(wc -l < "$FILE" | tr -d ' ')"
echo "Words:      $(wc -w < "$FILE" | tr -d ' ')"
echo "Characters: $(wc -c < "$FILE" | tr -d ' ')"
echo ""
echo "=== First 5 lines ==="
head -5 "$FILE"
echo ""
echo "=== Last 5 lines ==="
tail -5 "$FILE"
