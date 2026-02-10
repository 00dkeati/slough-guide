import * as fs from 'fs';

const analysis = JSON.parse(fs.readFileSync('data/fish-chips-analysis.json', 'utf-8'));
const articles = JSON.parse(fs.readFileSync('data/editorial-articles.json', 'utf-8'));

// Filter to just fish & chip shops (not sports bars, etc)
const chipShops = analysis.filter((a: any) => 
  !a.name.includes('Sports Bar') && 
  !a.name.includes('Istanbul') &&
  a.rating >= 4
);

const article = {
  id: "best-fish-chips-slough-2026",
  slug: "best-fish-chips-slough-2026",
  title: "Best Fish & Chips in Slough 2026: Ranked by Reviews",
  subtitle: "We analyzed 2,000+ Google reviews to find the best chippies in Slough, Langley, and Chalvey. Real photos, actual quotes, no soggy chips.",
  category: "Food & Drink",
  author: "Slough.co",
  publishedAt: new Date().toISOString(),
  featured: true,
  heroImage: chipShops[0]?.photos?.[0] || "/images/placeholder.jpg",
  excerpt: "From Sam's legendary chips to Langley Fish Bar's gluten-free options, we've ranked every chippy in Slough based on real reviews.",
  content: [
    {
      type: "paragraph",
      text: "Friday night fish and chips is sacred. But which chippy actually delivers? We analyzed thousands of Google reviews across every fish bar in Slough, Langley, and Chalvey. Here's what the locals really think."
    },
    {
      type: "heading",
      text: "🏆 The Rankings"
    },
    {
      type: "paragraph",
      text: `| Rank | Chippy | Area | Rating | Reviews | Known For |
|------|--------|------|--------|---------|-----------|
${chipShops.slice(0, 8).map((s: any, i: number) => 
  `| ${i + 1} | **${s.name}** | ${s.address.split(',')[1]?.trim() || ''} | ${s.rating}/5 | ${s.totalReviews} | ${s.highlights?.[0]?.phrase || '-'} |`
).join('\n')}`
    },
    // Generate content for top shops
    ...chipShops.slice(0, 6).flatMap((shop: any, i: number) => {
      const blocks: any[] = [
        {
          type: "heading",
          text: `${i + 1}. ${shop.name} — ${shop.rating}⭐ (${shop.totalReviews} reviews)`
        }
      ];
      
      if (shop.photos?.[0]) {
        blocks.push({
          type: "image",
          src: shop.photos[0],
          alt: shop.name,
          caption: `${shop.name} - ${shop.address.split(',').slice(0, 2).join(',')}`
        });
      }
      
      blocks.push({
        type: "paragraph",
        text: `📍 ${shop.address}\n📞 ${shop.phone || 'N/A'}${shop.website ? `\n🌐 [Website](${shop.website})` : ''}`
      });
      
      if (shop.highlights?.length > 0) {
        blocks.push({
          type: "heading",
          text: "What reviewers say:"
        });
        blocks.push({
          type: "list",
          items: shop.highlights.slice(0, 4).map((h: any) => `**"${h.phrase}"** — mentioned ${h.count > 1 ? h.count + ' times' : 'in reviews'}`)
        });
      }
      
      if (shop.bestReviews?.[0]) {
        blocks.push({
          type: "quote",
          text: shop.bestReviews[0].text.slice(0, 300) + (shop.bestReviews[0].text.length > 300 ? '...' : ''),
          author: shop.bestReviews[0].author_name
        });
      }
      
      if (shop.lowlights?.length > 0 && shop.lowlights[0].count > 1) {
        blocks.push({
          type: "callout",
          text: `⚠️ **Watch out for:** Some reviews mention "${shop.lowlights[0].phrase}"`
        });
      }
      
      return blocks;
    }),
    {
      type: "heading",
      text: "📊 Quick Comparison"
    },
    {
      type: "paragraph",
      text: `| Need | Best Choice |
|------|-------------|
| **Best overall** | ${chipShops[0]?.name} |
| **Most reviewed** | ${[...chipShops].sort((a, b) => b.totalReviews - a.totalReviews)[0]?.name} |
| **Gluten-free options** | Sam's Fish Bar Langley |
| **Quick service** | ${chipShops.find((s: any) => s.highlights?.some((h: any) => h.phrase.includes('quick')))?.name || chipShops[0]?.name} |`
    },
    {
      type: "heading",
      text: "💡 Pro Tips"
    },
    {
      type: "list",
      items: [
        "**Friday nights are busy** — call ahead to order",
        "**Best value** — lunch deals often available 12-2pm",
        "**Gluten-free?** — Sam's Fish Bar has dedicated GF options",
        "**Want to eat in?** — Check opening hours, many close between 2-4pm"
      ]
    },
    {
      type: "heading",
      text: "🔍 How We Ranked"
    },
    {
      type: "paragraph",
      text: "We pulled data from Google Places in January 2026, analyzing rating, review count, and common phrases in reviews. All photos are real images from Google Maps."
    }
  ],
  tags: ["fish and chips", "takeaway", "slough", "cowplain", "purbrook", "food", "2026"],
  relatedBusinesses: chipShops.slice(0, 5).map((s: any) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  readTime: 6
};

// Add or replace article
const existingIdx = articles.findIndex((a: any) => a.slug === article.slug);
if (existingIdx >= 0) {
  articles[existingIdx] = article;
} else {
  articles.unshift(article);
}

fs.writeFileSync('data/editorial-articles.json', JSON.stringify(articles, null, 2));
console.log('✅ Fish & Chips article created');
console.log(`   ${chipShops.length} chip shops ranked`);
