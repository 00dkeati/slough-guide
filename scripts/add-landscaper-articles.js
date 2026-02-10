const fs = require('fs');

// Read existing tradesperson articles
const existingArticles = JSON.parse(fs.readFileSync('./data/tradesperson-articles.json', 'utf8'));

// Landscaper data
const landscapers = [
  {
    name: "Level Scape",
    phone: "07854 453295",
    location: "Slough",
    address: "9 Laurel Rd, Slough",
    website: "http://www.levelscape.uk/",
    rating: 5.0,
    reviewCount: 29,
    quotes: [
      "Excellent work, very tidy and kept to time scales.",
      "The team transformed our outdoor space beyond expectations."
    ]
  },
  {
    name: "H & H Landscapes Group Ltd",
    phone: "07890 099858",
    location: "Slough",
    address: "20 Elmwood Ave, Slough",
    website: "http://www.handhlandscapes.com/",
    rating: 4.7,
    reviewCount: 31,
    quotes: [
      "David and his team did an excellent job of my garden refurbishment.",
      "Professional service from start to finish, highly recommend."
    ]
  },
  {
    name: "Nature Nurture Landscapes",
    phone: "07935 091086",
    location: "Lovedean",
    address: "Lovedean Ln, Slough",
    website: "http://naturenurturelandscapes.com/",
    rating: 4.9,
    reviewCount: 14,
    quotes: [
      "Listened to what we wanted and delivered it beautifully.",
      "Creative ideas and flawless execution."
    ]
  },
  {
    name: "Roger & Sarah's Gardening Services",
    phone: "023 9223 2800",
    location: "Slough",
    address: "2 Beaconsfield Rd, Slough",
    website: "http://www.rsgardeningservices.co.uk/",
    rating: 4.7,
    reviewCount: 54,
    quotes: [
      "In two days my garden was transformed into an amazing neat, and tidy haven.",
      "Reliable, hardworking, and always leave the place spotless."
    ]
  },
  {
    name: "Bridges Garden Services",
    phone: "07922 543977",
    location: "Denmead",
    address: "36 Hatchmore Rd, Denmead",
    website: "http://www.bridgesgardenservices.co.uk/",
    rating: 4.9,
    reviewCount: 50,
    quotes: [
      "Excellent service, did a great job and charged a fair price.",
      "Reliable and always delivers quality work."
    ]
  },
  {
    name: "Acre Lawn Turf Ltd",
    phone: "023 9259 3392",
    location: "Horndean",
    address: "205 Catherington Ln, Horndean",
    website: "http://www.acrelawnturf.com/",
    rating: 5.0,
    reviewCount: 20,
    quotes: [
      "The work performed by the team at Acre Lawn Turf Ltd was simply outstanding!",
      "Professional installation, beautiful results."
    ]
  },
  {
    name: "A&O Landscapes Portsmouth",
    phone: "07817 987741",
    location: "Portsmouth",
    address: "16 St Chad's Ave, Portsmouth",
    website: "https://www.aandolandscapes.co.uk/",
    rating: 5.0,
    reviewCount: 22,
    quotes: [
      "Dan from A&O Landscapes did a fantastic job resurfacing my shingle driveway.",
      "Professional, clean work with excellent communication."
    ]
  },
  {
    name: "S&K Garden and Trees",
    phone: "07794 322083",
    location: "Havant",
    address: "18 Tyrrel Lawn, Havant",
    website: "https://skgardenandtrees.com/",
    rating: 5.0,
    reviewCount: 66,
    quotes: [
      "Brilliant job by Kevin, removing a large tree and stump from my garden.",
      "He talked me through the procedure and left the garden tidy."
    ]
  },
  {
    name: "Williams Garden Services Ltd",
    phone: "07704 529035",
    location: "Fareham",
    address: "Wild Ridings, Fareham",
    website: "https://williamsgardenservices.com/",
    rating: 5.0,
    reviewCount: 177,
    quotes: [
      "They removed all the pieces they had cut off leaving the garden spotless.",
      "The most professional garden service we've ever used."
    ]
  },
  {
    name: "Palmscapes LTD",
    phone: "01489 661789",
    location: "Whiteley",
    address: "38 Bluebell Way, Whiteley",
    website: "http://www.palmscapes.co.uk/",
    rating: 5.0,
    reviewCount: 28,
    quotes: [
      "They transformed our garden into a much more suitable space for us.",
      "Listened to our needs and exceeded expectations."
    ]
  },
  {
    name: "TM Landscapes & Garden Design",
    phone: "023 8144 9950",
    location: "Southampton",
    address: "4 Wilkins Rd, Southampton",
    website: "https://www.tmconstruct.co.uk/",
    rating: 4.9,
    reviewCount: 70,
    quotes: [
      "The work on my driveway was done perfectly, everything was left immaculate.",
      "Attention to detail that sets them apart."
    ]
  },
  {
    name: "Southampton Homes",
    phone: "023 8155 0155",
    location: "Southampton",
    address: "WHA Industrial Estate, Allington Ln, Southampton",
    website: "https://southamptonhomes.co.uk/",
    rating: 4.9,
    reviewCount: 68,
    quotes: [
      "High quality materials and expert workmanship have transformed our garden.",
      "Professional team who deliver on every promise."
    ]
  },
  {
    name: "All Seasons Gardening Services",
    phone: "07759 371979",
    location: "Chichester",
    address: "1, The Barn, Warren Farm Ln, Tangmere",
    website: "http://www.allseasonsservices.co.uk/",
    rating: 5.0,
    reviewCount: 36,
    quotes: [
      "Fantastic job of clearing my garden, very professional and friendly service.",
      "Made a daunting task look easy."
    ]
  },
  {
    name: "Greenkeepers Tree Care",
    phone: "07862 259353",
    location: "Chichester",
    address: "Velyn Court, Velyn Ave, Chichester",
    website: "http://greenkeeperssussex.co.uk/",
    rating: 5.0,
    reviewCount: 45,
    quotes: [
      "After a long days work he left my garden clean and tidy.",
      "Expert tree work with minimal disruption."
    ]
  },
  {
    name: "Fallen&Found Arboriculture Ltd",
    phone: "01243 967808",
    location: "Emsworth",
    address: "34 Havant Rd, Emsworth",
    website: "https://fallenandfound.co.uk/",
    rating: 5.0,
    reviewCount: 47,
    quotes: [
      "He removed a huge tree for us and left it immaculate.",
      "Professional arborists who know their craft."
    ]
  }
];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createArticle(biz) {
  const slug = slugify(`${biz.name}-landscaper-gardener-${biz.location}`);
  
  return {
    id: slug,
    slug: slug,
    title: `${biz.name} – Landscaper & Garden Services: ${biz.reviewCount} Reviews And ${biz.rating} Stars. Why ${biz.location} Residents Trust Them`,
    subtitle: `The ${biz.location} landscaper with ${biz.reviewCount} Google reviews who delivers`,
    category: "Business Spotlight",
    author: "Slough.co",
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: `/images/businesses/${slug}.jpg`,
    excerpt: `${biz.name} - ${biz.rating} stars, ${biz.reviewCount} reviews. Call ${biz.phone}. Local landscaping and garden services.`,
    content: [
      {
        type: "paragraph",
        text: `There is a landscaper in ${biz.location} whose number (${biz.phone}) gets saved in contacts and passed around. ${biz.name} has built a ${biz.rating}-star reputation from ${biz.reviewCount} Google reviews by doing what matters: answering the phone, turning up on time, doing the work properly, and charging a fair price.`
      },
      {
        type: "heading",
        text: `${biz.reviewCount} People Took The Time To Leave Reviews`
      },
      {
        type: "paragraph",
        text: `That is not something that happens by accident. ${biz.reviewCount} people went onto Google and wrote about their experience. At ${biz.rating} stars, the pattern is clear: ${biz.name} does good work and treats customers fairly.`
      },
      {
        type: "quote",
        text: biz.quotes[0],
        author: "Google reviewer"
      },
      {
        type: "heading",
        text: "What Shows Up In The Reviews"
      },
      {
        type: "paragraph",
        text: `Reading through the reviews for ${biz.name}, the same themes come up repeatedly:`
      },
      {
        type: "list",
        items: [
          "**Reliable** — Turns up when they say they will. That should not be unusual, but it is.",
          "**Professional** — Knows the job. Explains what needs doing without the jargon.",
          "**Fair prices** — No surprise charges. Tells you what it costs before starting.",
          "**Clean and tidy** — Does not leave your garden looking like a building site.",
          "**Friendly** — Actually pleasant to have working on your property."
        ]
      },
      {
        type: "quote",
        text: biz.quotes[1],
        author: "Google reviewer"
      },
      {
        type: "heading",
        text: "Services"
      },
      {
        type: "paragraph",
        text: `${biz.name} covers landscaping, garden design, patios, fencing, turfing, tree work, and garden maintenance. Whether it is a small tidy-up or a complete garden transformation, reviewers report the same professional approach.`
      },
      {
        type: "heading",
        text: "Contact Details"
      },
      {
        type: "list",
        items: [
          `**Phone:** ${biz.phone}`,
          `**Address:** ${biz.address}`,
          `**Google rating:** ${biz.rating}/5 from ${biz.reviewCount} reviews`,
          biz.website ? `**Website:** [Visit website](${biz.website})` : null
        ].filter(Boolean)
      },
      {
        type: "paragraph",
        text: `That is it. A local landscaper with ${biz.reviewCount} reviews, ${biz.rating} stars, and a phone that actually gets answered. Call ${biz.phone} to get a quote, or look them up on Google to read all the reviews yourself.`
      }
    ],
    relatedBusinesses: [],
    tags: [
      "landscaper",
      "gardener",
      "garden services",
      "landscaping",
      "local tradesman",
      biz.location.toLowerCase()
    ],
    readTime: 3,
    businessPhone: biz.phone,
    businessWebsite: biz.website || null
  };
}

// Create new articles
const newArticles = landscapers.map(createArticle);

// Combine with existing
const allArticles = [...existingArticles, ...newArticles];

// Write back
fs.writeFileSync('./data/tradesperson-articles.json', JSON.stringify(allArticles, null, 2));

console.log(`Added ${newArticles.length} landscaper articles.`);
console.log(`Total articles: ${allArticles.length}`);
