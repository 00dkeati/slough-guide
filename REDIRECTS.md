# CSV-Driven Redirect System

A comprehensive temporary redirect system for Next.js applications that supports both build-time and runtime redirects for SEO hotfixes.

## 🚀 Features

- **Dual Layer System**: Build-time redirects (fast) + Runtime redirects (flexible)
- **CSV-Driven**: Easy to manage redirects via spreadsheet
- **Temporary Only**: All redirects are temporary (302, 303, 307) for SEO safety
- **Smart Filtering**: Automatically skips API routes, static assets, and Next.js internals
- **Error Handling**: Graceful handling of invalid rows, duplicates, and missing files
- **Caching**: Runtime redirects cached for 1 minute to improve performance
- **Validation**: Built-in validation and testing utilities

## 📁 File Structure

```
├── data/redirects.csv          # Source CSV file
├── public/redirects.csv        # Runtime CSV (copy of data/)
├── scripts/
│   ├── loadCsvRedirects.mjs    # CSV parser and loader
│   └── redirectUtils.mjs       # Validation and testing utilities
├── middleware.ts               # Edge middleware for runtime redirects
└── next.config.js              # Build-time redirect configuration
```

## 📋 CSV Format

The CSV file should have three columns: `from`, `to`, `status`

```csv
from,to,status
/old-article,/new-article,307
/outdated-page,https://www.example.com/fresh,302
/broken,/fixed
```

### Column Details

- **`from`**: Source URL path (e.g., `/old-page`)
- **`to`**: Destination URL path or absolute URL (e.g., `/new-page` or `https://example.com/new-page`)
- **`status`**: HTTP status code (optional, defaults to 307)
  - `302`: Temporary redirect
  - `303`: See Other
  - `307`: Temporary redirect (preserves HTTP method)

### CSV Rules

- Empty lines and lines starting with `#` are ignored (comments)
- Duplicate `from` paths will use the last occurrence
- Missing `status` defaults to 307
- Leading slashes are automatically added to `from` paths
- Multiple slashes are normalized (e.g., `//path` → `/path`)

## 🔧 Usage

### 1. Add Redirects

Edit `data/redirects.csv` with your redirects:

```csv
from,to,status
/old-blog-post,/blog/new-post,302
/contact-us,/contact,307
/broken-link,https://example.com/fixed,302
```

### 2. Copy to Public Directory

For runtime redirects, copy the CSV to the public directory:

```bash
cp data/redirects.csv public/redirects.csv
```

### 3. Deploy

- **Build-time redirects**: Automatically loaded during `next build`
- **Runtime redirects**: Available immediately via middleware

## 🛠️ Commands

```bash
# Validate CSV file
npm run validate-redirects

# Test redirect logic
npm run test-redirects

# Show help
npm run redirects-help
```

## 🔄 How It Works

### Build-Time Redirects (next.config.js)

- Loaded during build process
- Fastest performance (no runtime overhead)
- Requires redeploy to update
- Handled by Next.js routing system

### Runtime Redirects (middleware.ts)

- Loaded at request time
- Updates without redeploy (just update CSV)
- Cached for 1 minute to improve performance
- Handled by Edge Middleware

### Request Flow

1. Request comes in
2. Middleware checks if request should be bypassed
3. If not bypassed, checks runtime redirect table
4. If redirect found, returns redirect response
5. If no redirect, continues to Next.js routing
6. Next.js checks build-time redirects
7. If no redirect found, serves normal page

### Bypass Rules

The system automatically bypasses:
- Non-GET/HEAD requests
- API routes (`/api/*`)
- Next.js internals (`/_next/*`)
- Static assets (files with extensions)

## 🚨 Error Handling

### Invalid CSV Rows
- Missing `from` or `to` columns are skipped
- Invalid status codes default to 307
- Malformed URLs are logged as warnings

### Missing Files
- Missing CSV files return empty redirect list
- Runtime middleware gracefully handles fetch failures
- Build process continues even if CSV is missing

### Duplicates
- Last occurrence of duplicate `from` paths is used
- Warnings are logged for duplicate entries

## 📊 Performance

### Build-Time Redirects
- **Performance**: ⭐⭐⭐⭐⭐ (Fastest)
- **Update Time**: Requires redeploy
- **Use Case**: Stable redirects, high-traffic paths

### Runtime Redirects
- **Performance**: ⭐⭐⭐⭐ (Very Fast)
- **Update Time**: Immediate (1-minute cache)
- **Use Case**: Hotfixes, temporary redirects, A/B testing

## 🔍 Debugging

### Enable Logging

The system logs redirect activity:

```
[middleware] Refreshed redirect table with 5 entries
[middleware] Redirecting /old-page -> /new-page (302)
[next.config] Generated 3 redirect rules
```

### Common Issues

1. **Redirects not working**
   - Check CSV format and syntax
   - Verify file paths are correct
   - Check browser cache

2. **Performance issues**
   - Reduce CSV file size
   - Use build-time redirects for high-traffic paths
   - Check middleware matcher configuration

3. **Infinite redirects**
   - Ensure `from` and `to` paths are different
   - Check for circular redirects
   - Validate destination URLs

## 🎯 Best Practices

1. **Use build-time redirects** for permanent changes
2. **Use runtime redirects** for hotfixes and experiments
3. **Keep CSV files small** for better performance
4. **Test redirects** before deploying
5. **Monitor redirect logs** for issues
6. **Use 307 status** for POST/PUT requests
7. **Avoid circular redirects**

## 🔒 Security

- Only GET and HEAD requests are redirected
- API routes and static assets are bypassed
- No permanent redirects (all temporary)
- Input validation and sanitization
- Error handling prevents information leakage

## 📈 Monitoring

Monitor redirect performance and usage:

```bash
# Check redirect logs
grep "middleware.*Redirecting" /var/log/nextjs.log

# Validate redirects
npm run validate-redirects

# Test specific paths
curl -I https://yoursite.com/old-page
```

## 🚀 Deployment

### Vercel
- Both build-time and runtime redirects work automatically
- Update `public/redirects.csv` for immediate runtime updates
- Redeploy for build-time redirect updates

### Other Platforms
- Ensure Edge Middleware is supported for runtime redirects
- Build-time redirects work on all platforms
- Check platform-specific middleware limitations

---

**Need help?** Run `npm run redirects-help` for usage information and examples.
