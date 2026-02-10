import fs from 'fs';
import path from 'path';

// Read the current sitemap
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
let sitemapContent = '';

if (fs.existsSync(sitemapPath)) {
  sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
} else {
  // Create basic sitemap structure if it doesn't exist
  sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.slough.co/</loc>
    <lastmod>2025-10-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}

// List of all SEO pages
const seoPages = [
  'slough-asda',
  'fish-and-chips-slough',
  'things-to-do-in-slough',
  'car-wash-slough',
  'slough-wickes',
  'taxi-slough',
  'massage-slough',
  'plumber-slough',
  'car-hire-slough',
  'takeaways-slough',
  'dentist-slough',
  'restaurants-slough',
  'slough-shops',
  'slough-soft-play',
  'slough-postcode',
  'slough-town-centre',
  'beauty-salon-slough',
  'pet-shops-slough',
  'removals-slough',
  'electrician-slough',
  'handyman-slough',
  'cafes-slough',
  'hairdresser-slough',
  'slough-market',
  'doctor-slough',
  'car-service-slough',
  'painter-decorator-slough',
  'locksmith-slough',
  'slough-new-builds',
  'slough-news',
  'slough-high-street',
  'rental-properties-slough',
  'schools-in-slough',
  'pubs-in-slough',
  'mortgage-advisor-slough',
  'gas-engineer-slough',
  'secondary-schools-slough',
  'boiler-service-slough'
];

// Current date for lastmod
const currentDate = new Date().toISOString().split('T')[0];

// Function to add URL entries to sitemap
function addUrlsToSitemap(sitemap: string, urls: string[]): string {
  // Find the closing </urlset> tag
  const closingTagIndex = sitemap.lastIndexOf('</urlset>');
  
  if (closingTagIndex === -1) {
    console.error('Could not find closing </urlset> tag in sitemap');
    return sitemap;
  }
  
  // Generate URL entries
  const urlEntries = urls.map(url => `  <url>
    <loc>https://www.slough.co/seo/${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
  
  // Insert URL entries before closing tag
  const beforeClosing = sitemap.substring(0, closingTagIndex);
  const afterClosing = sitemap.substring(closingTagIndex);
  
  return beforeClosing + '\n' + urlEntries + '\n' + afterClosing;
}

// Check if URLs already exist in sitemap
function urlsExistInSitemap(sitemap: string, urls: string[]): boolean {
  return urls.some(url => sitemap.includes(`/seo/${url}`));
}

// Add SEO pages to sitemap if they don't already exist
if (!urlsExistInSitemap(sitemapContent, seoPages)) {
  sitemapContent = addUrlsToSitemap(sitemapContent, seoPages);
  
  // Write updated sitemap
  fs.writeFileSync(sitemapPath, sitemapContent);
  
  console.log(`✅ Added ${seoPages.length} SEO pages to sitemap`);
  console.log(`📁 Updated sitemap: ${sitemapPath}`);
} else {
  console.log('ℹ️  SEO pages already exist in sitemap');
}

// Also update robots.txt to ensure sitemap is referenced
const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
let robotsContent = '';

if (fs.existsSync(robotsPath)) {
  robotsContent = fs.readFileSync(robotsPath, 'utf-8');
} else {
  robotsContent = `User-agent: *
Allow: /

Sitemap: https://www.slough.co/sitemap.xml`;
}

// Check if sitemap is already referenced in robots.txt
if (!robotsContent.includes('Sitemap:')) {
  robotsContent += '\n\nSitemap: https://www.slough.co/sitemap.xml';
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ Updated robots.txt with sitemap reference');
} else {
  console.log('ℹ️  Sitemap already referenced in robots.txt');
}

console.log(`\n📊 Summary:`);
console.log(`   SEO pages: ${seoPages.length}`);
console.log(`   Sitemap updated: ${sitemapPath}`);
console.log(`   Robots.txt updated: ${robotsPath}`);
