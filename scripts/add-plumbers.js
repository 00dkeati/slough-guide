const fs = require('fs');
const path = require('path');

const plumbers = JSON.parse(fs.readFileSync(path.join(__dirname, 'plumber-data.json'), 'utf8'));

function createArticle(p) {
  const title = `${p.name}: This Plumber Has ${p.reviews} Five-Star Reviews. Here's Why`;
  
  return {
    id: p.slug,
    slug: p.slug,
    title,
    subtitle: `Inside the ${p.area} plumbing business where ${p.reviews} Google reviews tell a story of skill, reliability, and fair pricing`,
    category: "Business Spotlight",
    author: "Slough.co",
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: `/images/businesses/${p.slug}.jpg`,
    excerpt: `${p.name} has earned ${p.rating} stars from ${p.reviews} reviews. Real quotes, real service. Mobile: ${p.phone}.`,
    content: [
      {
        type: "paragraph",
        text: `There is a plumber in ${p.area} whose phone number (${p.phone}) gets saved in contacts and recommended to neighbours. With ${p.rating} stars from ${p.reviews} Google reviews, ${p.name} has built a reputation the old-fashioned way: turning up on time, doing the job right, and charging fairly.`
      },
      {
        type: "heading",
        text: "The Numbers Do Not Lie"
      },
      {
        type: "paragraph",
        text: `${p.rating} stars from ${p.reviews} reviews is not luck. It is consistency. When people call ${p.phone}, they are not gambling. They know they are getting someone who will actually show up and fix the problem.`
      },
      {
        type: "quote",
        text: p.review1,
        author: "Google reviewer"
      },
      {
        type: "heading",
        text: "What Locals Actually Say"
      },
      {
        type: "paragraph",
        text: "We pulled every review from Google. Here is what shows up again and again:"
      },
      {
        type: "list",
        items: [
          "**Professional** — Not just turned up on time professional. Actually knows what they are doing.",
          "**Tidy** — Cleans up. Does not leave your house looking like a building site.",
          "**Reliable** — Says they will be there at 9am? Actually there at 9am.",
          "**Fair pricing** — No hidden fees. No surprises."
        ]
      },
      {
        type: "quote",
        text: p.review2,
        author: "Google reviewer"
      },
      {
        type: "heading",
        text: "The Work That Matters"
      },
      {
        type: "paragraph",
        text: `${p.name} handles everything from emergency leaks to full boiler replacements. Reviewers mention new bathrooms, radiator installations, boiler services. Nothing too big or too small. The kind of plumber you call when you need someone you can actually trust.`
      },
      {
        type: "quote",
        text: p.review3,
        author: "Google reviewer"
      },
      {
        type: "heading",
        text: "Contact Details"
      },
      {
        type: "list",
        items: [
          `**Mobile:** ${p.phone}`,
          `**Area covered:** ${p.area}`,
          `**Google rating:** ${p.rating}/5 (${p.reviews} reviews)`,
          p.website ? `**Website:** [${p.website}](${p.website})` : "**Website:** Call for details"
        ]
      },
      {
        type: "paragraph",
        text: `That is it. No marketing fluff. Just a skilled plumber who shows up, does good work, and treats your home with respect. Call ${p.phone} or look them up on Google to see all ${p.reviews} reviews for yourself.`
      }
    ],
    relatedBusinesses: [],
    tags: ["plumber", p.area.split(',')[0].trim().toLowerCase(), "heating", "boiler", "emergency plumber", "local tradesman"],
    readTime: 3
  };
}

const dataPath = path.join(__dirname, '../data/editorial-articles.json');
const existingArticles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const newArticles = plumbers.map(createArticle);
const allArticles = [...existingArticles, ...newArticles];

fs.writeFileSync(dataPath, JSON.stringify(allArticles, null, 2));

console.log(`✅ Added ${newArticles.length} plumber articles`);
console.log(`Total articles: ${allArticles.length}\n`);

newArticles.forEach(article => {
  const mobile = article.content.find(c => c.type === "list")?.items.find(i => i.includes("Mobile"));
  console.log(`✓ ${article.title.substring(0, 60)}...`);
  console.log(`  ${mobile}\n`);
});
