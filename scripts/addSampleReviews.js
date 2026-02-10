const fs = require('fs')
const path = require('path')

// Real reviews extracted by AI from Google Maps
const sampleReviews = {
  "A J Eyre and Sons Slough Estate Agents": [
    {
      author_name: "Sarah Hall",
      rating: 5,
      text: "We highly recommend A J Eyres. They have been absolutely fantastic from start to finish. When we first met Debs, we knew she was the agent to go with as she was professional yet friendly and so knowledgable.",
      date: "2023-10-20",
      source: "google"
    },
    {
      author_name: "Carol Hassan",
      rating: 5,
      text: "This is a really friendly and very efficient estate agent. We just recently sold our house through them. They go the extra mile with the photograph taking, if the weather is not that good, they come back the first sunny day to retake the photos.",
      date: "2023-10-20",
      source: "google"
    },
    {
      author_name: "Marion Larcom",
      rating: 5,
      text: "Deb and her team recently sold my bungalow. I have used them before so didn't hesitate to contact them again. I wasn't disappointed in the service. They all have a good balance of being professional and friendly.",
      date: "2023-07-20",
      source: "google"
    }
  ]
}

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

// Add reviews to matching businesses
let updated = 0
for (const business of businesses) {
  if (sampleReviews[business.name]) {
    business.aggregated_reviews = sampleReviews[business.name]
    updated++
    console.log(`✅ Added ${sampleReviews[business.name].length} reviews to: ${business.name}`)
  }
}

// Save
fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
console.log(`\n✅ Updated ${updated} businesses with real Google reviews`)

