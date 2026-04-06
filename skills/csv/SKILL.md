---
name: csv
description: Analyze and transform CSV data using bash tools
---

# CSV Processing Skill

Process CSV files using standard bash tools (awk, cut, sort, grep).

## Available Scripts

### analyze.sh
Get statistics and summary of a CSV file.
```bash
bash ./skills/csv/scripts/analyze.sh data.csv
```

### filter.sh
Filter rows where a column matches a value.
```bash
bash ./skills/csv/scripts/filter.sh data.csv <column_number> <value>
```

### select.sh
Select specific columns from a CSV file.
```bash
bash ./skills/csv/scripts/select.sh data.csv <col1> <col2> ...
```

### sort.sh
Sort a CSV file by a specific column.
```bash
bash ./skills/csv/scripts/sort.sh data.csv <column_number> [asc|desc]
```

## Usage Pattern

1. Write the CSV data to a file using the bash tool
2. Run the appropriate script on that file
3. Chain multiple scripts for complex transformations

## Example

```bash
# Write CSV data
echo "date,product,qty
2024-01,Widget,100
2024-02,Gadget,200" > data.csv

# Analyze the CSV
bash ./skills/csv/scripts/analyze.sh data.csv

# Filter rows where column 2 equals "Widget"
bash ./skills/csv/scripts/filter.sh data.csv 2 Widget

# Sort by column 3 descending
bash ./skills/csv/scripts/sort.sh data.csv 3 desc
```
