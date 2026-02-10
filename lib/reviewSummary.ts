/**
 * AI Review Summary Generator
 * Analyzes customer reviews and generates professional summaries
 */

export async function generateReviewSummary(
  businessName: string, 
  reviews: string[] | { text: string }[]
): Promise<string | null> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY

  if (!OPENAI_API_KEY) {
    return null
  }

  const reviewTexts = reviews.map(r => typeof r === 'string' ? r : r.text)
  const reviewText = reviewTexts.slice(0, 30).join("\n\n")

  if (!reviewText || reviewText.trim().length < 50) {
    return null
  }

  const prompt = `You are a professional content writer for a local business directory in Slough.

Analyze these customer reviews and write a 2-3 paragraph professional summary highlighting:
1. Common positive themes
2. Any consistent feedback
3. Overall balanced assessment

Business: ${businessName}
Reviews: ${reviewText}

Write a professional 150-250 word overview:`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error('Error generating summary:', error)
    return null
  }
}

export function generateFallbackSummary(
  businessName: string,
  rating: number,
  reviewCount: number,
  category: string
): string {
  const ratingDesc = rating >= 4.8 ? 'exceptional' : rating >= 4.5 ? 'excellent' : rating >= 4.0 ? 'highly rated' : 'established'
  return `${businessName} is ${ratingDesc === 'exceptional' || ratingDesc === 'excellent' ? 'an' : 'a'} ${ratingDesc} ${category} in Slough, with a ${rating} star rating based on ${reviewCount} customer reviews.`
}

