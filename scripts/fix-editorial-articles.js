const fs = require('fs');

// Read current file
const rawData = JSON.parse(fs.readFileSync('./data/editorial-articles.json', 'utf8'));

// Get articles array
const articles = rawData.articles || rawData;

// Convert to proper editorial format
const convertedArticles = articles.map(biz => ({
  id: biz.slug || biz.id,
  slug: biz.slug || biz.id,
  title: biz.headline || biz.title,
  subtitle: `${biz.name} - ${biz.rating}★ from ${biz.reviewCount} reviews in ${biz.location}`,
  category: "Local Guide",
  author: "Slough.co",
  publishedAt: new Date().toISOString(),
  heroImage: `/images/editorial/landscaper-garden-${biz.location?.toLowerCase().replace(/\s+/g, '-') || 'slough'}.jpg`,
  excerpt: biz.article?.substring(0, 200) + '...' || `${biz.name} - ${biz.rating} stars, ${biz.reviewCount} reviews. Call ${biz.phone}.`,
  content: [
    {
      type: "paragraph",
      text: biz.article || `${biz.name} has earned ${biz.reviewCount} reviews with a ${biz.rating}-star rating. Located at ${biz.address}, they serve the ${biz.location} area.`
    },
    {
      type: "heading",
      text: "What Customers Say"
    },
    ...biz.reviews.map(review => ({
      type: "quote",
      text: review,
      author: "Google reviewer"
    })),
    {
      type: "heading",
      text: "Contact Details"
    },
    {
      type: "list",
      items: [
        `**Phone:** ${biz.phone}`,
        `**Address:** ${biz.address}`,
        `**Rating:** ${biz.rating}/5 from ${biz.reviewCount} reviews`,
        biz.website ? `**Website:** [Visit website](${biz.website})` : null
      ].filter(Boolean)
    }
  ],
  tags: ["landscaper", "gardener", "garden services", biz.location?.toLowerCase() || "slough"],
  readTime: 3
}));

// Write as proper array
fs.writeFileSync('./data/editorial-articles.json', JSON.stringify(convertedArticles, null, 2));

console.log(`Converted ${convertedArticles.length} articles to editorial format.`);
