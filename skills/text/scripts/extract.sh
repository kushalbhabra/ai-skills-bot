#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: extract.sh <file> --lines <start> <end>" >&2
    echo "       extract.sh <file> --pattern <pattern>" >&2
    exit 1
fi
FILE="$1"
MODE="$2"
if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

case "$MODE" in
    --lines)
        START="$3"
        END="$4"
        echo "=== Lines $START to $END from $FILE ==="
        sed -n "${START},${END}p" "$FILE"
        ;;
    --pattern)
        PATTERN="$3"
        echo "=== Lines matching '$PATTERN' from $FILE ==="
        grep "$PATTERN" "$FILE"
        ;;
    *)
        echo "Error: Unknown mode '$MODE'. Use --lines or --pattern" >&2
        exit 1
        ;;
esac
