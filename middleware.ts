import { NextRequest, NextResponse } from 'next/server';

let cachedAt = 0;
let cacheMs = 60000; // 1 minute cache
let table = new Map();

function shouldBypass(req: NextRequest): boolean {
  const url = new URL(req.url);
  const p = url.pathname;
  
  // Only handle GET and HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') return true;
  
  // Skip Next.js internals
  if (p.startsWith('/_next') || p.startsWith('/api')) return true;
  
  // Skip static assets (files with extensions)
  if (/\.[a-zA-Z0-9]{1,6}$/.test(p)) return true;
  
  return false;
}

function parseLine(line: string) {
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

async function refreshTable(req: NextRequest) {
  const now = Date.now();
  if (now - cachedAt < cacheMs && table.size > 0) return;

  try {
    // Try to fetch the CSV from the public directory
    const csvUrl = new URL('/redirects.csv', req.url).toString();
    const res = await fetch(csvUrl, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      console.warn(`[middleware] Could not fetch redirects CSV: HTTP ${res.status}`);
      return;
    }
    
    const text = await res.text();
    const map = new Map();
    const lines = text.split(/\r?\n/);
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
        console.warn(`[middleware] Duplicate redirect for ${rec.from}, using latest`);
      }
      map.set(rec.from, rec);
    }
    
    table = map;
    cachedAt = now;
    console.log(`[middleware] Refreshed redirect table with ${table.size} entries`);
    
  } catch (error) {
    console.error('[middleware] Error refreshing redirect table:', error);
  }
}

export async function middleware(req: NextRequest) {
  // Skip if this request should be bypassed
  if (shouldBypass(req)) {
    return NextResponse.next();
  }

  // Refresh the redirect table if needed
  await refreshTable(req);

  // Check if current path matches any redirect
  const pathname = req.nextUrl.pathname;
  const redirect = table.get(pathname);
  
  if (redirect) {
    console.log(`[middleware] Redirecting ${pathname} -> ${redirect.to} (${redirect.status})`);
    
    return NextResponse.redirect(redirect.to, {
      status: redirect.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
