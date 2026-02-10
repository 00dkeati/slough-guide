#!/bin/bash
# Rebrand waterlooville -> slough

cd ~/clawd/projects/slough-directory

# Delete Waterlooville-specific pages
rm -rf app/waterlooville-football-club
rm -rf app/waterlooville-recycling-centre
rm -rf app/driving-instructors-waterlooville
rm -rf app/dentist-waterlooville
rm -rf app/estate-agents-waterlooville
rm -rf app/painter-decorator-waterlooville
rm -rf app/guide-driving-instructors-waterlooville
rm -rf app/plumber-waterlooville
rm -rf app/willoughbys-windows

# Delete generated articles (will regenerate for Slough)
rm -rf generated-articles/*
rm -rf data/editorial-articles.json

# Mass replace in all files
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.js" -o -name "*.sql" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i '' 's/waterlooville/slough/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.js" -o -name "*.sql" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i '' 's/Waterlooville/Slough/g' {} \;

# Update postcodes (PO7/PO8 -> SL1/SL2/SL3)
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i '' 's/PO7/SL1/g' {} \;

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i '' 's/PO8/SL2/g' {} \;

echo "Rebrand complete!"
