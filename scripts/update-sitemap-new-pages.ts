import fs from 'fs';
import path from 'path';

// Read the current sitemap
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
let sitemapContent = '';

if (fs.existsSync(sitemapPath)) {
  sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
} else {
  console.error('Sitemap not found at:', sitemapPath);
  process.exit(1);
}

// New pages to add
const newPages = [
  'restaurants-slough',
  'painter-decorator-slough',
  'plumber-slough'
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
    <loc>https://www.slough.co/${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');
  
  // Insert URL entries before closing tag
  const beforeClosing = sitemap.substring(0, closingTagIndex);
  const afterClosing = sitemap.substring(closingTagIndex);
  
  return beforeClosing + '\n' + urlEntries + '\n' + afterClosing;
}

// Check if URLs already exist in sitemap
function urlsExistInSitemap(sitemap: string, urls: string[]): boolean {
  return urls.some(url => sitemap.includes(`/${url}</loc>`));
}

// Check if URLs exist under /seo/ path
function urlsExistInSeoPath(sitemap: string, urls: string[]): boolean {
  return urls.some(url => sitemap.includes(`/seo/${url}</loc>`));
}

// Add new pages to sitemap if they don't already exist
if (!urlsExistInSitemap(sitemapContent, newPages)) {
  sitemapContent = addUrlsToSitemap(sitemapContent, newPages);
  
  // Write updated sitemap
  fs.writeFileSync(sitemapPath, sitemapContent);
  
  console.log(`✅ Added ${newPages.length} new pages to sitemap`);
  console.log(`📁 Updated sitemap: ${sitemapPath}`);
} else {
  console.log('ℹ️  New pages already exist in sitemap');
}

// Check if they exist under /seo/ path
if (urlsExistInSeoPath(sitemapContent, newPages)) {
  console.log('ℹ️  Pages also exist under /seo/ path');
}

console.log(`\n📊 Summary:`);
console.log(`   New pages: ${newPages.length}`);
console.log(`   Pages: ${newPages.join(', ')}`);
console.log(`   Sitemap updated: ${sitemapPath}`);
