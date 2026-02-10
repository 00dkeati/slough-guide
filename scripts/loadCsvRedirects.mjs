import fs from 'fs';
import path from 'path';

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);

  const [rawFrom, rawTo, rawStatus] = parts.map(s => (s ?? '').trim());
  if (!rawFrom || !rawTo) return null;

  let from = rawFrom.startsWith('/') ? rawFrom : `/${rawFrom}`;
  from = from.replace(/\/{2,}/g, '/');

  const to = rawTo;
  const statusStr = (rawStatus || '').trim();
  let status = 307;
  if (statusStr === '302' || statusStr === '303' || statusStr === '307') {
    status = Number(statusStr);
  }

  return { from, to, status };
}

export function loadCsvRedirects(csvFilePath) {
  const abs = path.isAbsolute(csvFilePath)
    ? csvFilePath
    : path.join(process.cwd(), csvFilePath);

  if (!fs.existsSync(abs)) {
    console.warn(`[redirects] CSV not found at ${abs}; returning empty list`);
    return [];
  }

  const raw = fs.readFileSync(abs, 'utf8');
  const lines = raw.split(/\r?\n/);

  const map = new Map();
  let isFirstLine = true;
  
  for (const line of lines) {
    // Skip header row
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    
    const rec = parseLine(line);
    if (!rec) continue;
    
    // Handle duplicates by keeping the last one
    if (map.has(rec.from)) {
      console.warn(`[redirects] Duplicate redirect for ${rec.from}, using latest`);
    }
    map.set(rec.from, rec);
  }

  const results = Array.from(map.values());
  console.log(`[redirects] Loaded ${results.length} redirects from ${abs}`);
  return results;
}
