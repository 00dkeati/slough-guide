import * as fs from 'fs';

const analysis = JSON.parse(fs.readFileSync('data/pubs-analysis.json', 'utf-8'));
const articles = JSON.parse(fs.readFileSync('data/editorial-articles.json', 'utf-8'));

// Filter to actual pubs (rating 4+)
const pubs = analysis.filter((a: any) => a.rating >= 4);

const article = {
  id: "best-pubs-slough-2026",
  slug: "best-pubs-slough-2026",
  title: "Best Pubs in Slough 2026: Top 12 Ranked",
  subtitle: "From cosy village locals to gastropubs with gardens, we ranked every pub in Slough based on real Google reviews.",
  category: "Food & Drink",
  author: "Slough.co",
  publishedAt: new Date().toISOString(),
  featured: true,
  heroImage: pubs[0]?.photos?.[0] || "/images/placeholder.jpg",
  excerpt: "Number 73 leads the pack, but Bird in Hand has the most loyal regulars. Here's our data-driven guide to Slough's best pubs.",
  content: [
    {
      type: "paragraph",
      text: "Whether you're after a quiet pint, a Sunday roast, or somewhere dog-friendly with a beer garden, Slough has you covered. We analyzed reviews from over 7,000 pub-goers to rank the best locals in the area."
    },
    {
      type: "heading",
      text: "🏆 The Rankings"
    },
    {
      type: "paragraph",
      text: `| Rank | Pub | Rating | Reviews | Vibe |
|------|-----|--------|---------|------|
${pubs.slice(0, 10).map((p: any, i: number) => 
  `| ${i + 1} | **${p.name}** | ${p.rating}/5 | ${p.totalReviews} | ${p.highlights?.[0]?.phrase || '-'} |`
).join('\n')}`
    },
    // Generate content for top pubs
    ...pubs.slice(0, 6).flatMap((pub: any, i: number) => {
      const blocks: any[] = [
        {
          type: "heading",
          text: `${i + 1}. ${pub.name} — ${pub.rating}⭐ (${pub.totalReviews} reviews)`
        }
      ];
      
      if (pub.photos?.[0]) {
        blocks.push({
          type: "image",
          src: pub.photos[0],
          alt: pub.name,
          caption: pub.name
        });
      }
      
      blocks.push({
        type: "paragraph",
        text: `📍 ${pub.address}\n📞 ${pub.phone || 'N/A'}${pub.website ? `\n🌐 [Website](${pub.website})` : ''}`
      });
      
      if (pub.highlights?.length > 0) {
        blocks.push({
          type: "heading",
          text: "What locals say:"
        });
        blocks.push({
          type: "list",
          items: pub.highlights.slice(0, 4).map((h: any) => `**"${h.phrase}"** — mentioned ${h.count > 1 ? h.count + ' times' : 'by reviewers'}`)
        });
      }
      
      if (pub.bestReviews?.[0]) {
        blocks.push({
          type: "quote",
          text: pub.bestReviews[0].text.slice(0, 280) + (pub.bestReviews[0].text.length > 280 ? '...' : ''),
          author: pub.bestReviews[0].author_name
        });
      }
      
      if (pub.lowlights?.length > 0 && pub.lowlights[0].count > 1) {
        blocks.push({
          type: "callout",
          text: `⚠️ Some reviews mention: "${pub.lowlights[0].phrase}"`
        });
      }
      
      return blocks;
    }),
    {
      type: "heading",
      text: "🍺 Quick Guide"
    },
    {
      type: "paragraph",
      text: `| Looking for... | Try |
|----------------|-----|
| **Best overall** | ${pubs[0]?.name} |
| **Most popular** | ${[...pubs].sort((a, b) => b.totalReviews - a.totalReviews)[0]?.name} (${[...pubs].sort((a, b) => b.totalReviews - a.totalReviews)[0]?.totalReviews} reviews) |
| **Real ale** | ${pubs.find((p: any) => p.highlights?.some((h: any) => h.phrase.includes('ale')))?.name || 'The Heroes'} |
| **Beer garden** | ${pubs.find((p: any) => p.highlights?.some((h: any) => h.phrase.includes('garden')))?.name || 'The Bird in Hand'} |
| **Dog friendly** | ${pubs.find((p: any) => p.highlights?.some((h: any) => h.phrase.includes('dog')))?.name || 'Most welcome dogs'} |
| **Sunday roast** | ${pubs.find((p: any) => p.highlights?.some((h: any) => h.phrase.includes('roast')))?.name || 'The Bird in Hand'} |`
    },
    {
      type: "heading",
      text: "🔍 How We Ranked"
    },
    {
      type: "paragraph",
      text: "We pulled data from Google Places in January 2026, analyzing overall rating, review count, and recurring phrases in reviews. Photos are from Google Maps."
    }
  ],
  tags: ["pubs", "bars", "slough", "cowplain", "horndean", "drinks", "food", "2026"],
  relatedBusinesses: pubs.slice(0, 5).map((p: any) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  readTime: 7
};

// Add or replace article
const existingIdx = articles.findIndex((a: any) => a.slug === article.slug);
if (existingIdx >= 0) {
  articles[existingIdx] = article;
} else {
  articles.unshift(article);
}

fs.writeFileSync('data/editorial-articles.json', JSON.stringify(articles, null, 2));
console.log('✅ Pubs article created');
console.log(`   ${pubs.length} pubs ranked`);
