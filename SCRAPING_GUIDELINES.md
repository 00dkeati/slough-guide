# Web Scraping Best Practices

## Ethical Guidelines

1. **Respect robots.txt** - Always check and follow robots.txt rules
2. **Rate Limiting** - Maximum 10 requests per minute
3. **Identify yourself** - Use a descriptive User-Agent
4. **Cache results** - Don't re-scrape the same data
5. **Off-peak hours** - Run scrapers during low-traffic times
6. **Monitor impact** - If site slows down, stop immediately

## Legal Considerations

- ✅ Publicly available data only
- ✅ Attribution to Yell.com where data is used
- ✅ Don't violate terms of service
- ❌ Don't scrape personal data
- ❌ Don't republish content verbatim

## Our Implementation

- Polite delay: 2 seconds between requests
- Rate limit: 10 requests/minute
- Caching: Results saved to avoid re-scraping
- Attribution: Yell URL included in all scraped records

## Alternative: Use Yell API

Consider contacting Yell for API access:
- More reliable
- No scraping needed
- Official partnership opportunity
- https://www.yell.com/advertise/
