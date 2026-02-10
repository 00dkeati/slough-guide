# Slough.co SEO Audit Results
**Date:** 10 February 2026  
**Auditor:** Clawd (automated)

---

## 🚨 Critical: Broken Pages (404 Errors)

4 URLs in the sitemap return 404 errors:

| URL | Status |
|-----|--------|
| `/houses-for-sale-slough` | 404 |
| `/garages` | 404 |
| `/area/lovedean` | 404 |
| `/area/havant` | 404 |

**Action Required:** Either create these pages or remove them from the sitemap.

---

## ⚠️ Broken Outbound Links

Found **15 broken Google Maps Place Photo URLs** returning 400 errors.

### Root Cause
The URLs contain HTML-encoded ampersands (`&amp;`) instead of plain `&`. This is a template/encoding bug.

### Affected Pages
- `/plumbers` (1 broken image)
- `/restaurants` (1 broken image)
- `/estate-agents` (13 broken images)

### Example Broken URL
```
https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&amp;photoreference=...
```
Should be:
```
https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=...
```

**Fix:** Check the Google Places photo URL rendering code and ensure ampersands aren't double-encoded.

---

## 📏 Pages with Title Tags Over 60 Characters

**69 pages** have title tags exceeding the 60-character Google SERP limit. Here are the worst offenders:

| Page | Title | Chars |
|------|-------|-------|
| `/seo/dog-walker-slough` | Dog Walker Slough - Professional Dog Walking Services \| Slough Directory \| Slough.co | **105** |
| `/seo/dog-walks-near-slough` | Dog Walks Near Slough - Best Walking Routes for Dogs \| Slough Directory \| Slough.co | **104** |
| `/slough-recycling-centre` | Slough Recycling Centre \| Opening Hours, Location &amp; What to Bring 2026 \| Slough.co | **100** |
| `/estate-agents` | Best Estate Agents in Slough 2026 \| Local Property Experts - Compare All \| Slough.co | **98** |
| `/slough-sainsburys` | Sainsbury's Slough \| Opening Hours, Location &amp; Services 2026 \| Slough.co | **95** |
| `/slough-argos` | Argos Slough \| Opening Hours, Location &amp; Click &amp; Collect 2026 \| Slough.co | **95** |
| `/seo/painter-decorator-slough` | Best Painters &amp; Decorators in Slough - Interior &amp; Exterior \| Slough.co | **92** |
| `/carpenters` | Best Carpenters &amp; Joiners in Slough \| Expert Woodwork Services \| Slough.co | **92** |
| `/seo/takeaways-slough` | Best Takeaways in Slough 2026 \| Chinese, Indian, Fish &amp; Chips \| Slough.co | **91** |
| `/part-time-jobs-slough` | Part Time Jobs in Slough 2026 \| Local Employment Opportunities \| Slough.co | **88** |

### All Long Titles (Full List)

<details>
<summary>Click to expand all 69 titles</summary>

| Page | Title | Chars |
|------|-------|-------|
| `/categories` | Browse Categories \| Slough Directory 2026 \| Slough.co | 67 |
| `/part-time-jobs-slough` | Part Time Jobs in Slough 2026 \| Local Employment Opportunities \| Slough.co | 88 |
| `/estate-agents` | Best Estate Agents in Slough 2026 \| Local Property Experts - Compare All \| Slough.co | 98 |
| `/slough-sainsburys` | Sainsbury's Slough \| Opening Hours, Location &amp; Services 2026 \| Slough.co | 95 |
| `/slough-asda` | Asda Slough \| Opening Hours, Location &amp; Services 2026 \| Slough.co | 83 |
| `/slough-argos` | Argos Slough \| Opening Hours, Location &amp; Click &amp; Collect 2026 \| Slough.co | 95 |
| `/slough-wickes` | Wickes Slough \| DIY Store Opening Hours &amp; Location 2026 \| Slough.co | 85 |
| `/slough-recycling-centre` | Slough Recycling Centre \| Opening Hours, Location &amp; What to Bring 2026 \| Slough.co | 100 |
| `/slough-football-club` | Slough Football Club \| Fixtures, Stadium &amp; History 2026 \| Slough.co | 85 |
| `/editorial` | Editorial Articles \| Slough Directory \| Slough.co | 63 |
| `/news` | Slough News \| Local News &amp; Updates \| Slough.co | 64 |
| `/blog` | Blog - Slough News, Tips &amp; Community Stories \| Slough.co | 74 |
| `/search` | Search Local Businesses in Slough \| Business Directory \| Slough.co | 80 |
| `/about` | About Slough Directory \| Local Business Directory \| Slough.co | 75 |
| `/contact` | Contact Slough Directory \| Get in Touch \| Slough.co | 65 |
| `/get-featured` | Get Your Business Featured \| Slough Directory \| Slough.co | 71 |
| `/seo/loft-conversions-hampshire` | Loft Conversions Hampshire \| Costs &amp; Companies 2026 \| Slough.co | 74 |
| `/seo/loft-conversions-portsmouth` | Loft Conversions Portsmouth \| Best Companies 2026 \| Slough.co | 68 |
| `/seo/loft-conversion-slough` | Loft Conversion Slough \| Best Companies 2026 \| Slough.co | 70 |
| `/seo/plumber-slough` | Best Plumbers in Slough 2026 \| Emergency &amp; Heating \| Slough.co | 80 |
| `/seo/electrician-slough` | Electrician Slough – Complete Guide 2025 \| Slough.co | 66 |
| `/seo/gas-engineer-slough` | Gas Engineer Slough – Complete Guide 2025 \| Slough.co | 67 |
| `/seo/hairdresser-slough` | Hairdresser Slough – Complete Guide 2025 \| Slough.co | 66 |
| `/seo/dentist-slough` | Dentist Slough – Complete Guide 2025 \| Slough.co | 62 |
| `/seo/restaurants-slough` | Best Restaurants in Slough 2026 \| Top 15 Rated &amp; Reviewed \| Slough.co | 87 |
| `/seo/pubs-in-slough` | Pubs In Slough - Slough Directory \| Slough.co | 66 |
| `/seo/takeaways-slough` | Best Takeaways in Slough 2026 \| Chinese, Indian, Fish &amp; Chips \| Slough.co | 91 |
| `/seo/fish-and-chips-slough` | Fish and Chips Slough – Best Local Takeaways 2025 \| Slough.co | 75 |
| `/seo/taxi-slough` | Taxi Slough - Slough Directory \| Slough.co | 63 |
| `/seo/driving-instructor-slough` | Driving Instructor Slough - Slough Directory \| Slough.co | 77 |
| `/seo/locksmith-slough` | Locksmith Slough - Slough Directory \| Slough.co | 68 |
| `/seo/handyman-slough` | Best Handymen in Slough - Home Repairs &amp; Maintenance \| Slough.co | 82 |
| `/seo/painter-decorator-slough` | Best Painters &amp; Decorators in Slough - Interior &amp; Exterior \| Slough.co | 92 |
| `/seo/beauty-salon-slough` | Beauty Salon Slough – Complete Guide 2025 \| Slough.co | 67 |
| `/seo/boiler-service-slough` | Boiler Service Slough – Complete Guide 2025 \| Slough.co | 69 |
| `/seo/cafes-slough` | Cafes Slough – Best Coffee Shops &amp; Light Bites 2025 \| Slough.co | 81 |
| `/seo/things-to-do-in-slough` | Things To Do In Slough - Slough Directory \| Slough.co | 74 |
| `/seo/slough-shops` | Best Shops in Slough - Shopping Guide &amp; Retail Directory \| Slough.co | 86 |
| `/seo/slough-market` | Slough Market - Local Shopping &amp; Fresh Produce \| Slough.co | 76 |
| `/seo/slough-news` | Slough News - Slough Directory \| Slough.co | 63 |
| `/seo/houses-for-sale-slough` | Houses For Sale Slough - Slough Directory \| Slough.co | 74 |
| `/seo/rental-properties-slough` | Rental Properties Slough - Slough Directory \| Slough.co | 76 |
| `/seo/slough-estate-agents` | Best Estate Agents in Slough 2025 - Top Rated Property Experts \| Slough.co | 88 |
| `/seo/schools-in-slough` | Schools In Slough - Slough Directory \| Slough.co | 69 |
| `/seo/nurseries-in-slough` | Nurseries In Slough - Slough Directory \| Slough.co | 71 |
| `/seo/dog-walker-slough` | Dog Walker Slough - Professional Dog Walking Services \| Slough Directory \| Slough.co | 105 |
| `/seo/dog-walks-near-slough` | Dog Walks Near Slough - Best Walking Routes for Dogs \| Slough Directory \| Slough.co | 104 |
| `/plumbers` | Plumber Slough \| 20 Local Plumbers Rated &amp; Reviewed 2026 \| Slough.co | 86 |
| `/electricians` | Best Electricians in Slough 2026 \| Local Electrical Services \| Slough.co | 86 |
| `/roofers` | Best Roofers in Slough \| Slough Directory \| Slough.co | 74 |
| `/builders` | Best Builders in Slough \| Slough Directory \| Slough.co | 75 |
| `/carpenters` | Best Carpenters &amp; Joiners in Slough \| Expert Woodwork Services \| Slough.co | 92 |
| `/restaurants` | Best Restaurants in Slough 2026 \| Local Dining Guide \| Slough.co | 78 |
| `/cafes` | Best Cafes in Slough 2026 \| Coffee Shops &amp; Breakfast Spots \| Slough.co | 88 |
| `/pubs` | Best Pubs in Slough 2026 \| Local Pubs, Bars &amp; Gastropubs \| Slough.co | 86 |
| `/takeaways` | Best Takeaways in Slough \| Slough Directory \| Slough.co | 76 |
| `/hairdressers` | Best Hairdressers in Slough 2026 \| Hair Salons &amp; Barbers \| Slough.co | 86 |
| `/beauty-salons` | Best Beauty Salons in Slough \| Slough Directory \| Slough.co | 80 |
| `/solicitors` | Best Solicitors in Slough \| Slough Directory \| Slough.co | 77 |
| `/accountants` | Best Accountants in Slough \| Slough Directory \| Slough.co | 78 |
| `/gyms` | Gyms Slough \| Best Fitness Centres &amp; Health Clubs 2026 \| Slough.co | 84 |
| `/dentists` | Best Dentists in Slough \| Slough Directory \| Slough.co | 75 |
| `/vets` | Best Vets in Slough \| Slough Directory \| Slough.co | 71 |
| `/area/slough` | Businesses in Slough \| Slough Directory \| Slough.co | 72 |
| `/area/cowplain` | Businesses in Cowplain \| Slough Directory \| Slough.co | 67 |
| `/area/horndean` | Businesses in Horndean \| Slough Directory \| Slough.co | 67 |
| `/area/denmead` | Businesses in Denmead \| Slough Directory \| Slough.co | 66 |
| `/area/purbrook` | Businesses in Purbrook \| Slough Directory \| Slough.co | 67 |
| `/area/clanfield` | Businesses in Clanfield \| Slough Directory \| Slough.co | 68 |
| `/area/leigh-park` | Businesses in Leigh Park \| Slough Directory \| Slough.co | 69 |

</details>

### Title Tag Recommendations

1. **Remove "| Slough.co" from all titles** - Your domain is already shown in SERPs
2. **Use shorter, punchier titles** - e.g. "Best Plumbers Slough 2026 | 20+ Rated"
3. **Target 50-55 characters** to leave room for Google's rendering

---

## 📝 Additional Notes

### Sitemap Issues
- Sitemap uses non-www URLs (`slough.co`) but site redirects to `www.slough.co`
- Recommend updating sitemap to use www URLs directly to avoid redirect chain

### Year Inconsistency
- Some pages show "2025" in titles, others show "2026"
- Suggest automating year in titles to current year

---

## Summary

| Issue | Count | Priority |
|-------|-------|----------|
| Broken pages (404) | 4 | 🔴 High |
| Broken outbound links | 15 | 🟡 Medium |
| Long title tags (>60 chars) | 69 | 🟡 Medium |

**Next Steps:**
1. Fix or remove the 4 broken pages from sitemap
2. Fix the Google Maps photo URL encoding issue
3. Shorten title tags across the site
