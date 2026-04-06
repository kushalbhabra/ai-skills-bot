---
name: text
description: Analyze and search text files using bash tools
---

# Text Processing Skill

Analyze and search text files using standard bash tools (wc, grep, awk, sed).

## Available Scripts

### stats.sh
Get statistics about a text file (line count, word count, character count).
```bash
bash ./skills/text/scripts/stats.sh file.txt
```

### search.sh
Search for a pattern in a text file.
```bash
bash ./skills/text/scripts/search.sh file.txt <pattern>
```

### extract.sh
Extract lines matching a pattern or line range from a file.
```bash
bash ./skills/text/scripts/extract.sh file.txt --lines <start> <end>
bash ./skills/text/scripts/extract.sh file.txt --pattern <pattern>
```

### wordfreq.sh
Count word frequency in a text file.
```bash
bash ./skills/text/scripts/wordfreq.sh file.txt [--top <n>]
```

## Usage Pattern

1. Write the text data to a file using the bash tool
2. Run the appropriate script on that file
3. Chain multiple scripts for complex analysis

## Example

```bash
# Write text data
echo "The quick brown fox jumps over the lazy dog
The dog barked at the fox" > story.txt

# Get statistics
bash ./skills/text/scripts/stats.sh story.txt

# Search for a word
bash ./skills/text/scripts/search.sh story.txt fox

# Get top 5 most frequent words
bash ./skills/text/scripts/wordfreq.sh story.txt --top 5
```
