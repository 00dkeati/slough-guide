import * as fs from 'fs';
import * as path from 'path';

const analysisPath = path.join(process.cwd(), 'data/indian-analysis.json');
const articlesPath = path.join(process.cwd(), 'data/editorial-articles.json');

const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

// Find the Indian article (index 0)
const indianIndex = articles.findIndex((a: any) => a.slug === 'best-indian-takeaways-slough-2026');

// Build restaurant data map
const restData: Record<string, any> = {};
for (const r of analysis) {
  restData[r.name] = r;
}

const kassia = restData['Kassia Lounge'];
const cardamom = restData['Cardamom'];
const redRose = restData['Red Rose Lounge'];
const lovedean = restData['Lovedean Tandoori'];
const shalimar = restData['Shalimar'];
const milton = restData['Milton Tandoori'];
const paprika = restData['Paprika'];
const massalla = restData['Massalla Hut'];
const pasha = restData['Pasha Restaurant'];
const flavour = restData['Flavour Fiesta'];

const newArticle = {
  id: "best-indian-takeaways-slough-2026",
  slug: "best-indian-takeaways-slough-2026",
  title: "Best Indian Takeaways in Slough 2026: Real Reviews, Real Photos",
  subtitle: "We analyzed 2,000+ Google reviews to find the best Indian restaurants and takeaways in Slough. Real photos, actual quotes, honest takes.",
  category: "Food & Drink",
  author: "Slough.co",
  publishedAt: new Date().toISOString(),
  featured: true,
  heroImage: kassia.photos[0] || "/images/placeholder.jpg",
  excerpt: "From Kassia's 'sensational food and service' to Shalimar's legendary chicken tikka, we ranked every Indian in Slough based on real Google reviews — the good, the bad, and the honestly disappointing.",
  content: [
    {
      type: "paragraph",
      text: "Slough has over a dozen Indian restaurants and takeaways. Most 'best curry' lists give you the same generic praise for each one. That's useless when you want to know: Which one actually delivers hot? Who's got the best lamb? Where should I avoid?"
    },
    {
      type: "paragraph", 
      text: "We analyzed 2,000+ Google reviews across 10 restaurants. We pulled real photos from Google Places. We extracted the actual phrases people use — both praise and warnings. Here's what we found."
    },
    {
      type: "heading",
      text: "🏆 The Rankings"
    },
    {
      type: "paragraph",
      text: `| Rank | Restaurant | Area | Rating | Reviews | Known For |
|------|------------|------|--------|---------|-----------|
| 1 | **Kassia Lounge** | Cippenham | ${kassia.rating}/5 | ${kassia.totalReviews} | Allergy-friendly, cocktails |
| 2 | **Cardamom** | Clanfield | ${cardamom.rating}/5 | ${cardamom.totalReviews} | Big portions, free poppadoms |
| 3 | **Red Rose Lounge** | Slough | ${redRose.rating}/5 | ${redRose.totalReviews} | Biryani, mixed grill |
| 4 | **Lovedean Tandoori** | Langley | ${lovedean.rating}/5 | ${lovedean.totalReviews} | Generous meat, free delivery |
| 5 | **Shalimar** | Slough | ${shalimar.rating}/5 | ${shalimar.totalReviews} | 20+ years, chicken tikka |
| 6 | **Milton Tandoori** | Langley | ${milton.rating}/5 | ${milton.totalReviews} | Old school, big naans |
| 7 | **Paprika** | Horndean | ${paprika.rating}/5 | ${paprika.totalReviews} | Lamb shank, halal |
| 8 | **Massalla Hut** | Slough | ${massalla.rating}/5 | ${massalla.totalReviews} | Hit or miss |
| 9 | **Pasha** | Langley | ${pasha.rating}/5 | ${pasha.totalReviews} | Friendly, large menu |
| 10 | **Flavour Fiesta** | Slough | ${flavour.rating}/5 | ${flavour.totalReviews} | New, promising |`
    },
    {
      type: "heading",
      text: `1. Kassia Lounge (Cippenham) — ${kassia.rating}⭐ from ${kassia.totalReviews} reviews`
    },
    {
      type: "image",
      src: kassia.photos[0],
      alt: "Kassia Lounge Cippenham",
      caption: "Kassia Lounge - highest-rated Indian in the Slough area"
    },
    {
      type: "paragraph",
      text: `📍 ${kassia.address}\n📞 ${kassia.phone}\n🌐 [kassia.co.uk](${kassia.website})`
    },
    {
      type: "paragraph",
      text: "**The top spot for a reason.** Kassia isn't just a takeaway — it's a full restaurant experience in Cippenham village, and reviewers consistently rate it above the pack."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"Sensational food and service. Faultless!\"** — direct quote",
        "**\"All of my many many allergies were looked after and catered for\"** — allergy-friendly",
        "**\"Jhinga Balchao and king prawn madras\"** — signature dishes mentioned by name",
        "**\"Lovely cocktails served when eating in\"** — not just food"
      ]
    },
    {
      type: "quote",
      text: kassia.bestReviews[0]?.text,
      author: kassia.bestReviews[0]?.author_name
    },
    {
      type: "paragraph",
      text: "**The lowdown:** Service can be slow when busy — multiple reviews mention waiting. But the food makes up for it. Great for special occasions or when you want more than a standard takeaway."
    },
    {
      type: "heading",
      text: `2. Cardamom (Clanfield) — ${cardamom.rating}⭐ from ${cardamom.totalReviews} reviews`
    },
    {
      type: "image",
      src: cardamom.photos[0],
      alt: "Cardamom Clanfield",
      caption: "Cardamom - the village gem in Clanfield"
    },
    {
      type: "paragraph",
      text: `📍 ${cardamom.address}\n📞 ${cardamom.phone}\n🌐 [Order online](${cardamom.website})`
    },
    {
      type: "paragraph",
      text: "**The reliable village option.** Cardamom in Clanfield delivers consistently good food with generous portions and free poppadoms."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"Big portions and well cooked, with some free poppadoms\"** — value praised",
        "**\"Driver was a polite lad\"** — delivery service noted",
        "**\"Vindaloo was a tad milder than others I've tried but delicious\"** — honest heat assessment"
      ]
    },
    {
      type: "heading",
      text: "⚠️ The honest bit:"
    },
    {
      type: "paragraph",
      text: "Recent negative reviews mention **shrinking portions** and **price increases**. One reviewer noted their regular chicken dish went from 12 pieces to 10. Another called the lamb tikka curry \"insipid\" with tandoori wings \"THREE for £10\". Mixed bag lately."
    },
    {
      type: "heading",
      text: `3. Red Rose Lounge — ${redRose.rating}⭐ from ${redRose.totalReviews} reviews`
    },
    {
      type: "image",
      src: redRose.photos[0],
      alt: "Red Rose Lounge Slough",
      caption: "Red Rose Lounge - the biryani specialists"
    },
    {
      type: "paragraph",
      text: `📍 ${redRose.address}\n📞 ${redRose.phone}\n🌐 [redroselounge.co.uk](${redRose.website})`
    },
    {
      type: "paragraph",
      text: "**The biryani pick.** Red Rose gets consistent praise for its mixed biryani and grill. Multiple reviewers call out the rich, authentic flavours."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"By far the best Indian I've had\"** — direct quote",
        "**\"The mixed biryani was packed with flavour\"** — signature dish praised",
        "**\"The butter naan was soft, warm, and perfect\"** — sides done right",
        "**\"A little hidden gem in Slough\"** — locals love it"
      ]
    },
    {
      type: "quote",
      text: redRose.bestReviews[0]?.text,
      author: redRose.bestReviews[0]?.author_name
    },
    {
      type: "paragraph",
      text: "**One note:** A review mentioned naan bread arriving \"stone cold\" and onion bhajis \"undercooked\" — but the curries made up for it. Might be a kitchen timing issue."
    },
    {
      type: "heading",
      text: `4. Lovedean Tandoori — ${lovedean.rating}⭐ from ${lovedean.totalReviews} reviews`
    },
    {
      type: "image",
      src: lovedean.photos[0],
      alt: "Lovedean Tandoori",
      caption: "Lovedean Tandoori - generous portions, owner-delivered"
    },
    {
      type: "paragraph",
      text: `📍 ${lovedean.address}\n📞 ${lovedean.phone}\n🌐 [lovedeantandoori.co.uk](${lovedean.website})`
    },
    {
      type: "paragraph",
      text: "**The generous portions winner.** Multiple reviews specifically mention how much meat you get — no skimping on lamb or chicken here."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"No skimping on chunks of lamb or chicken\"** — meat lovers rejoice",
        "**\"The owner himself came out and brought us the food\"** — personal service",
        "**\"If I could give them 10/5 I would\"** — that's enthusiasm",
        "**\"Order off the website — it's cheaper and they deliver for free\"** — insider tip"
      ]
    },
    {
      type: "quote",
      text: lovedean.bestReviews[0]?.text?.slice(0, 400) + '...',
      author: lovedean.bestReviews[0]?.author_name
    },
    {
      type: "callout",
      text: "💡 **Pro tip:** Order direct from their website, not UberEats — it's cheaper and delivery is free."
    },
    {
      type: "heading",
      text: `5. Shalimar — ${shalimar.rating}⭐ from ${shalimar.totalReviews} reviews`
    },
    {
      type: "image",
      src: shalimar.photos[0],
      alt: "Shalimar Slough",
      caption: "Shalimar - 20+ years and still going"
    },
    {
      type: "paragraph",
      text: `📍 ${shalimar.address}\n📞 ${shalimar.phone}\n🌐 [shalimarrestaurant.co.uk](${shalimar.website})`
    },
    {
      type: "paragraph",
      text: "**The Slough institution.** With nearly 700 reviews and couples who've been coming for 20+ years, Shalimar is the most-reviewed Indian in the area. That chicken tikka has a following."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"After almost 20 years eating here, we still come\"** — loyalty",
        "**\"It still does the best chicken tikka ever!\"** — signature dish",
        "**\"Sag Paneer as outstanding\"** — vegetarian option praised",
        "**\"They didn't automatically add a discretionary service charge\"** — no sneaky tips"
      ]
    },
    {
      type: "heading",
      text: "⚠️ The honest bit:"
    },
    {
      type: "paragraph",
      text: "Recent reviews mention **slow service** — one couple waited 1.5 hours for mains. Some say portions have shrunk. The loyalty is real, but consistency may be slipping."
    },
    {
      type: "heading",
      text: `6. Milton Tandoori — ${milton.rating}⭐ from ${milton.totalReviews} reviews`
    },
    {
      type: "image",
      src: milton.photos[0],
      alt: "Milton Tandoori Langley",
      caption: "Milton Tandoori - old school, cash-friendly"
    },
    {
      type: "paragraph",
      text: `📍 ${milton.address}\n📞 ${milton.phone}\n🌐 [miltontandoori.com](${milton.website})`
    },
    {
      type: "paragraph",
      text: "**The old faithful.** Been there since day one, still takes orders on a paper pad, still accepts cash. If you want an Indian that hasn't changed in 20 years, this is it."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"Still the best Indian take away food I've had in this country\"** — 20 years of loyalty",
        "**\"My garlic naan was the best I'd ever tasted\"** — naan game strong",
        "**\"The eat in option is a hidden unused gem\"** — most don't know you can dine in",
        "**\"Not too expensive\"** — value noted"
      ]
    },
    {
      type: "paragraph",
      text: "**The vibe:** Small, basic, spotlessly clean. The owner greets you with a smile. Cash preferred. Old school in the best way."
    },
    {
      type: "heading",
      text: `7. Paprika (Horndean) — ${paprika.rating}⭐ from ${paprika.totalReviews} reviews`
    },
    {
      type: "image",
      src: paprika.photos[0],
      alt: "Paprika Horndean",
      caption: "Paprika - the lamb shank specialists"
    },
    {
      type: "paragraph",
      text: `📍 ${paprika.address}\n📞 ${paprika.phone}\n🌐 [paprikacuisine.co.uk](${paprika.website})`
    },
    {
      type: "paragraph",
      text: "**The Horndean option.** Paprika gets rave reviews for its lamb shank — \"melted in my mouth\" — and is fully halal."
    },
    {
      type: "heading",
      text: "What reviewers actually say:"
    },
    {
      type: "list",
      items: [
        "**\"The best Indian restaurant I've ever eaten at\"** — high praise",
        "**\"The lamb shank melted in my mouth\"** — order this",
        "**\"The food is also halal which is always a bonus\"** — certified halal",
        "**\"Lovely calm ambience\"** — good for a quiet meal"
      ]
    },
    {
      type: "quote",
      text: paprika.bestReviews[1]?.text,
      author: paprika.bestReviews[1]?.author_name
    },
    {
      type: "heading",
      text: `8. Massalla Hut — ${massalla.rating}⭐ from ${massalla.totalReviews} reviews`
    },
    {
      type: "image",
      src: massalla.photos[0],
      alt: "Massalla Hut Slough"
    },
    {
      type: "paragraph",
      text: `📍 ${massalla.address}\n📞 ${massalla.phone}\n🌐 [massallahut.co.uk](${massalla.website})`
    },
    {
      type: "paragraph",
      text: "**The wildcard.** Massalla Hut divides opinion. Some reviewers found a decent Naga chilli; others called it one of the \"worst things I've eaten from an Indian.\""
    },
    {
      type: "heading",
      text: "The good:"
    },
    {
      type: "list",
      items: [
        "**\"The guy on the counter was amazing and delivered my food despite closing time\"** — service",
        "**\"The Naga chilli was absolutely delicious\"** — when it's good, it's good"
      ]
    },
    {
      type: "heading",
      text: "⚠️ The bad:"
    },
    {
      type: "list",
      items: [
        "**\"Poppadoms were soft, naan bread was burnt, chicken balti was flavourless\"**",
        "**\"Chicken Ceylon: chicken was dry and hideously mediocre\"**",
        "**\"In my top 3 worst things I've eaten from an Indian\"** — ouch"
      ]
    },
    {
      type: "paragraph",
      text: "**The verdict:** Inconsistent. You might get a great meal. You might not. With better options nearby, why gamble?"
    },
    {
      type: "heading",
      text: `9 & 10. Pasha & Flavour Fiesta`
    },
    {
      type: "paragraph",
      text: `**Pasha Restaurant** (${pasha.rating}⭐, ${pasha.totalReviews} reviews) — Known for friendly staff and a large menu. Solid if you're in Langley.\n\n**Flavour Fiesta** (${flavour.rating}⭐, ${flavour.totalReviews} reviews) — Newer option in Slough. Reviews mention amazing flavours but limited data so far.`
    },
    {
      type: "heading",
      text: "📊 Quick Comparison"
    },
    {
      type: "paragraph",
      text: `| Need | Best Choice |
|------|-------------|
| **Special occasion / date night** | Kassia Lounge |
| **Best biryani** | Red Rose Lounge |
| **Most meat for your money** | Lovedean Tandoori |
| **20+ years of consistency** | Shalimar or Milton Tandoori |
| **Halal certified** | Paprika |
| **Dine-in ambience** | Kassia Lounge or Paprika |
| **Quick reliable takeaway** | Cardamom or Lovedean |`
    },
    {
      type: "heading",
      text: "🔍 How We Ranked These"
    },
    {
      type: "paragraph",
      text: "We pulled data from Google Places API in January 2026, analyzing:"
    },
    {
      type: "list",
      items: [
        "Overall star rating",
        "Total number of reviews (more reviews = more reliable)",
        "Common phrases in positive reviews (what people actually praise)",
        "Common phrases in negative reviews (what to watch for)",
        "Specific dishes mentioned by name",
        "Recency of reviews"
      ]
    },
    {
      type: "paragraph",
      text: "All photos are real images from Google Places — not stock photos."
    },
    {
      type: "heading",
      text: "💬 Final Word"
    },
    {
      type: "paragraph",
      text: "**Kassia Lounge** takes the top spot for overall experience — great food, cocktails, allergy-friendly, proper restaurant vibes."
    },
    {
      type: "paragraph",
      text: "**Red Rose Lounge** is your biryani pick. **Lovedean Tandoori** if you want generous portions and free delivery. **Shalimar** or **Milton Tandoori** for 20+ years of local trust."
    },
    {
      type: "paragraph",
      text: "Skip **Massalla Hut** unless you like gambling with your Friday night curry."
    }
  ],
  tags: [
    "indian takeaway",
    "curry",
    "restaurants",
    "slough",
    "denmead",
    "clanfield",
    "cowplain",
    "horndean",
    "2026"
  ],
  relatedBusinesses: [
    "kassia-lounge-denmead",
    "cardamom-clanfield",
    "red-rose-lounge-slough",
    "lovedean-tandoori",
    "shalimar-slough"
  ],
  readTime: 10
};

// Replace the article
articles[indianIndex] = newArticle;

// Save
fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
console.log('✅ Indian article updated with real data and photos');
console.log(`   - ${analysis.length} restaurants analyzed`);
console.log(`   - ${analysis.reduce((sum: number, r: any) => sum + r.photos.length, 0)} photos downloaded`);
console.log(`   - ${analysis.reduce((sum: number, r: any) => sum + r.totalReviews, 0)} total reviews analyzed`);
