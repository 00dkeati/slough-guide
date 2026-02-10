const fs = require('fs')
const path = require('path')

// Real reviews from estate agent review document
const estateAgentReviews = {
  "Wainwright Estates": {
    google_rating: 4.6,
    google_reviews: 63,
    facebook_rating: 5.0,
    facebook_reviews: 19,
    positive: [
      {
        author_name: "Nicola Hodge",
        rating: 5,
        text: "I had an excellent experience when I rented from Wainwrights in Saltash. I was particularly impressed with their quick response time to all my queries. Staff were all very professional, and they made the entire process smooth and stress free. Thank you for finding my perfect property.",
        date: "2024-06-12",
        source: "google"
      },
      {
        author_name: "Tara Cooper",
        rating: 5,
        text: "Recently purchased a property through Wainwrights. Cannot recommend them enough. Carly & Ross really went above and beyond to support us in our purchase of our new property, communicating with solicitors and recommending and speaking to removers which really saved the day! Great communication, kept in regular contact and answered all queries in a timely manner. From viewing to completion they were excellent.",
        date: "2023-10-12",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Linda Evans",
        rating: 1,
        text: "Bought a property through this agent, no wouldn't recommend. Very mixed bag, plenty of chasing etc done, they assisted/contacted prev owners ref the drive full of belongings on moving day, they said the previous owner was 'challenged' so they knew something was wrong, bills of post, 3 bailiffs and now a police raid with 5 police and 3 cars ! Don't know who is responsible for all this stuff....",
        date: "2022-10-12",
        source: "google"
      },
      {
        author_name: "Shaggy Arnold",
        rating: 1,
        text: "Booked a viewing for a rental property and they couldn't be bothered to turn up and lied to us on the phone. Lazy and unprofessional wasting my time and fuel.",
        date: "2024-02-12",
        source: "google"
      }
    ]
  },
  "Archbold & Edwards": {
    google_rating: 4.6,
    google_reviews: 126,
    positive: [
      {
        author_name: "Ryan Rix",
        rating: 5,
        text: "Martin and the team from start to finish were great to deal with. They sold our house within 2 weeks of us listing up for sale and for the price we asked for. I would certainly choose them over other estate agents!",
        date: "2024-09-28",
        source: "google"
      },
      {
        author_name: "G C",
        rating: 5,
        text: "We have used Archbold and Edwards Martin and Charlie for a good many years now and would not hesitate to use them again. The service they give is just perfect. Professional, and yet simple and wanting to get the job done. We've used them for renting a property and selling a property. If there are awards in Estate agencies Archbold and Edwards should win hands down. Thank you all so much.",
        date: "2024-08-12",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Max",
        rating: 1,
        text: "Players buyers off against each other in bad faith, I would honestly never buy or sell my properties through this company. Dishonest, untrustworthy, Avoid avoid avoid.",
        date: "2023-12-12",
        source: "google"
      },
      {
        author_name: "Kay Bell",
        rating: 1,
        text: "Unprofessional service and company. I put an offer in for a property recently, which was 5% below the asking price. This is not unreasonable in the current market...",
        date: "2022-10-12",
        source: "google"
      }
    ]
  },
  "A J Eyre and Sons Slough Estate Agents": {
    google_rating: 4.9,
    google_reviews: 68,
    positive: [
      {
        author_name: "Sarah Hall",
        rating: 5,
        text: "We highly recommend AJ Eyres. They have been absolutely fantastic from start to finish. When we first met Debs, we knew she was the agent to go with as she was professional yet friendly and so knowledgable. Then came Emma to photograph our house with super results and a lovely manner too. Amy was amazing once the house sold, with frequent updates and we can't thank her enough for chasing solicitors! Everyone we have dealt with has been outstanding in their commitment to selling our home and always been friendly and informative. We had a few little humps along the way to do with other people in the chain but A J Eyres were always there to reassure. We would not go with anyone else in the future. Thank you so much to you, Debs and your fab team!",
        date: "2024-08-15",
        source: "google"
      },
      {
        author_name: "Carol Hassan",
        rating: 5,
        text: "This is a really friendly and very efficient estate agent. We just recently sold our house through them and the whole process was made very easy. Debs and her team are very professional and helpful. Would highly recommend.",
        date: "2024-07-20",
        source: "google"
      },
      {
        author_name: "Emma Candlish-Welford",
        rating: 5,
        text: "We chose AJ Eyre & Sons to sell my MIL's retirement apartment as they impressed us with their honesty, knowledge and reasonable price. We made the right choice! Emma worked like a Trojan to keep the chain together, along with great input from Debs and Amy. We were delighted with the service we received from A J Eyre Estate Agents. They were clearly very knowledgeable. They were very positive and gave us great confidence. Their marketing approach was very active and skilled. We were very pleased with the outcome and would highly recommend them.",
        date: "2024-06-10",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Christine Watts",
        rating: 1,
        text: "Did not respond to two requests for a valuation.",
        date: "2024-01-15",
        source: "google"
      },
      {
        author_name: "Liza Hunter",
        rating: 1,
        text: "I literally can't recommend the team at A J Eyre enough. We have sold two properties with them and they couldn't do enough to help. Emma was so professional and friendly throughout the entire process and went above and beyond with chase ups. However, on this occasion, I was buying a property from them. It has been so stressful with moving out of our rental property with 12 weeks notice. They were so helpful, until the sale was agreed and then the communication stopped. I had to chase for updates and it felt like I was bothering them. I would not recommend buying a property from them.",
        date: "2023-11-20",
        source: "google"
      }
    ]
  },
  "Cubitt & West Slough Estate Agents": {
    google_rating: 4.8,
    google_reviews: 90,
    trustpilot_rating: 4.6,
    trustpilot_reviews: 5951,
    positive: [
      {
        author_name: "Jess",
        rating: 5,
        text: "Cubbitt & West were great, all the staff we met or spoke with were friendly and helpful. Elliot was so informative when he came to view the property, his knowledge of the market was obvious and of the valuations we had he made the most sense. House sold within a few weeks and the process was straight forward, Julie kept us up to date and was always helpful when we had questions. Would definitely use again.",
        date: "2024-08-01",
        source: "google"
      },
      {
        author_name: "Liam O",
        rating: 5,
        text: "Our experience has been nothing short of incredible. Julie Bramble has been absolutely amazing and always goes above and beyond. As a first time buyer, I had 1001 questions and Julie always was happy to help answer. Julie is an asset to your team and I couldn't have imagined going through this process without her support and kindness.",
        date: "2024-07-15",
        source: "google"
      },
      {
        author_name: "Richard Salvage",
        rating: 5,
        text: "Mo Numans on 19 July at Gladys Avenue Cowplain was very professional and knowledgeable about the property. He was able to answer questions with confidence and in an informative way. It was a pleasure to listen to him. There was something about him that was above other agents we had already seen. Thank you Richard S",
        date: "2024-07-19",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Robert Staunton",
        rating: 1,
        text: "Appalling Customer Service. First off, this should be no stars. I arranged to view 2 properties in the Yapton area both confirmed by email, I arrived 30 mins before the due time of 3pm at the first property and waited till 3.30, I phoned office and spoke to them and they said no bookings in diary for either property. I asked for manager to call me back and instead an hour later the sales rep who should have showed me round phoned me and said her car had broken down and she had left her mobile in the office so either she is lying or the person who took my call earlier is.",
        date: "2023-06-15",
        source: "trustpilot"
      },
      {
        author_name: "Matthew",
        rating: 1,
        text: "Unprofessional and Embarrassing. After finding the property to rent in Pulborough, we immediately came up against C&W's archaic system of having to bid for a rental... something soon to be outlawed I believe. We were keen on the property, so we naturally overpaid, but that was only the start of the horrendous experience.",
        date: "2024-08-20",
        source: "trustpilot"
      }
    ]
  },
  "Jeffries & Dibbens Estate Agents - Slough": {
    google_rating: 4.5,
    google_reviews: 56,
    trustpilot_rating: 3.0,
    trustpilot_reviews: 6,
    positive: [
      {
        author_name: "J Powell",
        rating: 5,
        text: "Excellent agents! 10 out of 10! We did our research and knew before appointing them as our agents that they were the best in town and they did not disappoint. From the initial valuation to exchange/completion, they were professional, friendly and extremely knowledgeable. Jessica Stray handled our sales progression excellently.",
        date: "2024-07-01",
        source: "getagent"
      },
      {
        author_name: "Alana M",
        rating: 5,
        text: "We recently sold our house on Guildford Road with Jeffries and I would not hesitate to use them again. Exceptional service from start to finish from the whole team. I must say Harry especially was very efficient and friendly, and kept us up to date constantly throughout the process. I can't thank them enough!",
        date: "2024-06-20",
        source: "google"
      },
      {
        author_name: "Kelly Rus",
        rating: 5,
        text: "Jeffries and Dibbens have been amazing right from Day 1. Rio came round to our house, was warm and friendly and really made the situation the best it could be (despite my multiple emails!)",
        date: "2024-05-15",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Thoyba C",
        rating: 1,
        text: "I was in the process of buying my property and the service from Jeffries was awful I feel they went very unhelpful. Also when I tried viewing the property they didn't want me to go view it and once we completed and were allowed to view it I realised the garden it was full of animal poo and that they were purposefully trying to not let me view it. Iv brought a few properties and this was worst experience I have had with any an estate agent. His name was Harry and he was condescending very time I was on the phone to him. Would not recommend the Estate agent as well any of their other services.",
        date: "2023-08-10",
        source: "google"
      },
      {
        author_name: "Anonymous",
        rating: 1,
        text: "Awful experience especially with Harry at the north end branch, put my property with another estate agents , then threats of we introduced all these fictous people, well won't be recommended Jeffries to my all my family and friends.",
        date: "2023-05-20",
        source: "trustpilot"
      },
      {
        author_name: "Anonymous",
        rating: 1,
        text: "What a waste of time, I am a investor wanting to buy a property.. they want to know every single thing before you view... Good luck selling your property with this crowd..",
        date: "2023-04-15",
        source: "trustpilot"
      }
    ]
  },
  "Fox and Sons Estate Agents Slough": {
    google_rating: 4.6,
    google_reviews: 67,
    trustpilot_rating: 2.9,
    trustpilot_reviews: 399,
    positive: [
      {
        author_name: "Marc Crowhurst",
        rating: 5,
        text: "Although we ultimately didn't proceed with selling our property due to a change in personal circumstances, we still wanted to share how impressed we were with the service from Fox & Sons in Slough.",
        date: "2024-08-05",
        source: "google"
      },
      {
        author_name: "Zoë Ingram",
        rating: 5,
        text: "I cannot recommend Leah Stephens enough. As a first time buyer currently going through the stages of owning our first property, Leah has been incredible at answering my questions, concerns as well as breaking down the process in a way that was easy to understand.",
        date: "2024-07-20",
        source: "google"
      },
      {
        author_name: "Michael Adesanya",
        rating: 5,
        text: "Leah Stephens at Fox & Sons was fantastic to work with. As a first time buyer, Leah made the whole mortgage process as easy and stress-free as possible, guiding me through everything clearly, answering all my question in great detail.",
        date: "2024-06-28",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "George",
        rating: 1,
        text: "They added me to a mailing list that I never agreed to join, with no way to unsubscribe. Every time I receive an email from them I will leave a one star review.",
        date: "2024-03-10",
        source: "google"
      },
      {
        author_name: "Verified User",
        rating: 1,
        text: "I wish I Had seen the reviews before I went with Fox & Son. yes they sold our house but for the money they're charging they put in very little effort. there has been no communication and they never called back.",
        date: "2023-11-05",
        source: "trustpilot"
      },
      {
        author_name: "Verified User",
        rating: 1,
        text: "Awful. Enthusiastic and charming to get your business then incompetent throughout the whole sale. Weeks without viewings. Phone calls and requests never returned, lack of communication between buyer and seller.",
        date: "2023-09-18",
        source: "trustpilot"
      }
    ]
  },
  "Leaders Letting & Estate Agents Slough": {
    google_rating: 5.0,
    google_reviews: 346,
    trustpilot_rating: 3.4,
    trustpilot_reviews: 19,
    positive: [
      {
        author_name: "Geoffrey Morden",
        rating: 5,
        text: "I would like to thank the team at Leaders, Slough, for the service Chloe provided when the property was was let out to tenants and the period before the property was marketed. Many Thanks",
        date: "2024-08-20",
        source: "google"
      },
      {
        author_name: "Holly Player",
        rating: 5,
        text: "A big thankyou to Eloise, who helped me find my new property, she was super friendly and helped quickly with any questions I had! 🙂",
        date: "2024-07-30",
        source: "google"
      },
      {
        author_name: "Louise",
        rating: 5,
        text: "From the start of the process to exchanging Louise has been 100 % an absolute diamond. She has commuicate wtih us every step of the way with kindness, professionalism and determination.",
        date: "2024-06-15",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "James Mclaughlin",
        rating: 1,
        text: "Have rerented our house with Leaders. Service very poor, accounts services very very poor. Long wait for our money. Would not recommend and are looking at taking them to the ombudsman. Very unhappy customer.",
        date: "2023-12-20",
        source: "google"
      },
      {
        author_name: "JDGB",
        rating: 1,
        text: "Please Read this!! Will save you Lots of Money! Read this to save yourself money in the long run. All tenants Avoid!!! They will always side with the landlord and once you move out the property they will find anything to charge hundreds for. They are trying to charge us £216 for dust they found at the back of a radiator. Leaders will let themselves into your property without your permission. This happened to us while we were away and they took pictures of our belongings, we felt very unsafe after this.",
        date: "2023-10-05",
        source: "google"
      },
      {
        author_name: "Rose Boxall",
        rating: 1,
        text: "I had a very long and difficult sale with Leaders due to the chain. Katie Isaacs guided me through with updates and when I needed information was always helpful and nothing was too much trouble.",
        date: "2024-02-28",
        source: "google"
      }
    ]
  },
  "Pearsons Estate Agents Slough": {
    google_rating: 4.8,
    google_reviews: 90,
    trustpilot_rating: 2.5,
    trustpilot_reviews: 5,
    positive: [
      {
        author_name: "Helen Hatton",
        rating: 5,
        text: "Great helpful service from start to finish with Tom, Paul and Louise at Slough. I was kept informed and updated regularly, making the sale of my property in a tricky sales market much easier. I would highly recommend.",
        date: "2024-08-10",
        source: "google"
      },
      {
        author_name: "Scott Long",
        rating: 5,
        text: "Outstanding Service from Start to Finish! Pearson's provided exceptional service both in selling my property and helping me secure my dream home. Their professionalism, dedication, and willingness to go above and beyond made the entire process seamless and stress-free for me and my family. I couldn't be more grateful.",
        date: "2024-07-22",
        source: "google"
      },
      {
        author_name: "Catherine Orak",
        rating: 5,
        text: "My experience of selling my property through Pearson's was a very positive one. All of the staff conduct themselves in a very professional manner but with empathy and understanding of the stress that comes with moving house. I would highly recommend them and thank them for the service they provided.",
        date: "2024-06-18",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Vasi Giani",
        rating: 1,
        text: "Time wasters. Nobody in the office anytime you ask for someone who deal with renting properties. After a week someone finally answered, give my details and nothing back. (Portsmouth area)",
        date: "2023-09-10",
        source: "google"
      },
      {
        author_name: "Customer",
        rating: 1,
        text: "Horrible rat experience that never got sorted. Started off a good experience but moment we got into the house we had issues and Pearsons Southampton didn't really do a lot. So after a week of living at the house we heard noises in the loft which turned out to be rats. We spoke to the neighbours as both sides said no they couldn't hear anything. We reported it to Pearsons and they got pest control out.",
        date: "2023-07-25",
        source: "google"
      },
      {
        author_name: "Muhammad Ismail",
        rating: 1,
        text: "Awful Service - Pearsons Southampton. Avoid Pearsons Southampton to avoid living a nightmare experience in renting because of their non-professionalism.",
        date: "2023-05-12",
        source: "trustpilot"
      }
    ]
  },
  "Mann Sales and Letting Agents Slough": {
    google_rating: 4.6,
    google_reviews: 181,
    trustpilot_rating: 2.9,
    trustpilot_reviews: 207,
    positive: [
      {
        author_name: "Jess Mann",
        rating: 5,
        text: "I honestly cannot fault Josh and Charlie from Mann Slough. We never actually used them to sell our home but they were selling the house we purchased. We worked with many estate agents throughout our lengthy one year house sale journey and I am so glad we finished off with these guys. Always helpful, always responsive and genuinely just lovely people to deal with. They are a credit to Mann and I would highly recommend them to anyone looking to buy or sell in the area.",
        date: "2024-08-15",
        source: "google"
      },
      {
        author_name: "Kenya Tate",
        rating: 5,
        text: "Louisa has been incredibly helpful and kind throughout our entire moving process. From our very first viewing to the day we collected the keys, she kept everything clear and stress-free, always responding quickly to any questions we had. Her professionalism and friendly approach made what could have been a daunting experience truly enjoyable. We are so grateful for her support and highly recommend her services!",
        date: "2024-07-28",
        source: "google"
      },
      {
        author_name: "Katey Allen",
        rating: 5,
        text: "I had a great experience with Shannon and the new apprentice. They were both extremely helpful, polite, and attentive to all our needs. Communication was excellent throughout — they responded quickly and kept us well-informed every step of the way. Thanks for making the whole process smooth and stress-free!",
        date: "2024-06-30",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Milan Kurtosi",
        rating: 2,
        text: "Company erected a 'To Let' board/post in our front garden. We are not renting out our house - they came here, entered our property without permission, and put it up without making sure it was the right address. An absolute disgrace, they will be reported to the police/council. They must have stepped on our lily, which has sentimental value - it is now almost sideways. 😡 No respect to our property whatsoever.",
        date: "2024-05-10",
        source: "google"
      },
      {
        author_name: "Giuliano Tona",
        rating: 1,
        text: "Think a lot of these reviews are fake or just excited new tenants. This place is housed with unprofessional, dishonest employees. Also from what I've seen the landlords get ripped off too!",
        date: "2023-11-15",
        source: "google"
      },
      {
        author_name: "Ron Oz",
        rating: 2,
        text: "I was contacted by Milan while in the middle of being work to 'get some details together' and 'get to know me a little better'. What he really wanted to know was wether I had a mortgage advisor to which I said I do he then wouldn't let go on why I didn't have mortgage in principle and implied that my mortgage advisor cant be a good one if he has not forced us into one.",
        date: "2023-09-08",
        source: "google"
      }
    ]
  },
  "O'Hara Properties & Estates": {
    google_rating: 4.0,
    google_reviews: 5,
    positive: [
      {
        author_name: "Lauren E G Maidens",
        rating: 5,
        text: "The team at O'Hara helped us to get our dream home through the craziest week of our lives and we couldn't be more grateful! They kept us up to date and informed through out the whole process and we couldn't have done it without them.",
        date: "2024-07-15",
        source: "google"
      },
      {
        author_name: "Mark Rogers",
        rating: 5,
        text: "I would not normally write a review, regardless of the situation. I am however making an exception regarding O'Hara Properties and Estates. Excellent service from start to finish.",
        date: "2024-06-20",
        source: "google"
      },
      {
        author_name: "Stanley Chase",
        rating: 5,
        text: "I used these guys for the purchase of a property in the local area, they were efficient and professional from offer to completion. Highly recommend. Ashley Allen",
        date: "2024-05-10",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "Randomer 100",
        rating: 1,
        text: "Need to work on their customer service and telephone manners",
        date: "2023-12-05",
        source: "google"
      },
      {
        author_name: "Shiva Sivananthan",
        rating: 1,
        text: "Viewing the website!! Thanks",
        date: "2023-10-15",
        source: "google"
      }
    ]
  },
  "Sarah Oliver Property": {
    google_rating: 4.9,
    google_reviews: 36,
    positive: [
      {
        author_name: "Jamie Simpson",
        rating: 5,
        text: "We had a fantastic experience working with Sarah and Ellen during the purchase of our new home. From start to finish, they were professional, proactive, and incredibly supportive.",
        date: "2024-08-20",
        source: "google"
      },
      {
        author_name: "Oliver Jewer",
        rating: 5,
        text: "We were really impressed with how Ellen and Sarah marketed our property. This achieved the sale of our house within only a couple of weeks of listing.",
        date: "2024-07-25",
        source: "google"
      },
      {
        author_name: "Perry Osborne",
        rating: 5,
        text: "The team at Sold By were absolutely fantastic from start to finish. After experiencing a sale that fell through with a previous agent, they immediately stepped in and guided us with professionalism and genuine care. They were always just a phone call away.",
        date: "2024-06-30",
        source: "google"
      }
    ],
    negative: [
      {
        author_name: "No negative reviews found",
        rating: 0,
        text: "No negative reviews available for this estate agent",
        date: "2024-01-01",
        source: "none"
      }
    ]
  }
}

console.log('📝 Adding Real Estate Agent Reviews from Document\n')

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

let updated = 0
let totalReviewsAdded = 0

for (const business of businesses) {
  const reviewData = estateAgentReviews[business.name]
  
  if (reviewData) {
    // Combine positive and negative reviews
    const allReviews = [...reviewData.positive, ...reviewData.negative]
    
    business.aggregated_reviews = allReviews
    business.review_count = reviewData.google_reviews || business.review_count
    business.rating = reviewData.google_rating || business.rating
    
    updated++
    totalReviewsAdded += allReviews.length
    
    console.log(`✅ ${business.name}`)
    console.log(`   Rating: ${business.rating}/5 (${business.review_count} total reviews)`)
    console.log(`   Added: ${reviewData.positive.length} positive + ${reviewData.negative.length} negative`)
    console.log('')
  }
}

// Save
fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

console.log('='.repeat(50))
console.log(`✅ COMPLETE!`)
console.log(`Updated: ${updated} estate agents`)
console.log(`Total reviews added: ${totalReviewsAdded}`)
console.log(`Data saved to: public/data/businesses.json`)
console.log('')
console.log('🎯 Reviews will now appear on /estate-agents page:')
console.log('   • 3 positive reviews (green boxes)')
console.log('   • 3 negative reviews (orange boxes)')
console.log('   • Real customer feedback from Google, Trustpilot, GetAgent')

