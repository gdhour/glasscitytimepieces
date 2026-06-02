#!/bin/bash
# GCT Photo Converter
# Converts HEIC photos to web-ready JPEGs using macOS built-in sips tool.
# No installation needed — sips ships with every Mac.
#
# USAGE:
#   1. Open Terminal
#   2. cd /Users/mali/my-first-app
#   3. ./convert-photos.sh /path/to/your/photos
#
# EXAMPLE:
#   ./convert-photos.sh ~/Desktop/new-watch-photos
#
# OUTPUT: Converted JPEGs land in public/collection/ ready for the site.

set -e

SOURCE_DIR="${1}"
OUTPUT_DIR="$(dirname "$0")/public/collection"

if [ -z "$SOURCE_DIR" ]; then
  echo "Usage: ./convert-photos.sh /path/to/photos"
  echo "Example: ./convert-photos.sh ~/Desktop/new-watch-photos"
  exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Folder not found: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

COUNT=0
for file in "$SOURCE_DIR"/*.{heic,HEIC,jpg,JPG,jpeg,JPEG,png,PNG}; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")
  name="${filename%.*}"
  output="$OUTPUT_DIR/${name}.jpg"

  echo "Converting: $filename → ${name}.jpg"
  sips -s format jpeg -s formatOptions 85 "$file" --out "$output" > /dev/null 2>&1
  COUNT=$((COUNT + 1))
done

if [ $COUNT -eq 0 ]; then
  echo "No image files found in: $SOURCE_DIR"
else
  echo ""
  echo "Done. $COUNT photo(s) converted and saved to public/collection/"
  echo "They're ready to use on the site."
fi
