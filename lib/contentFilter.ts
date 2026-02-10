// Content moderation utilities for filtering profanity and spam

// Common profanity list (expandable)
const profanityList = [
  'fuck', 'shit', 'damn', 'bitch', 'ass', 'bastard', 'crap', 'piss',
  'dick', 'cock', 'pussy', 'cunt', 'twat', 'wank', 'bollocks',
  'arse', 'bugger', 'bloody', 'prick', 'slut', 'whore',
  // Add variations with numbers
  'f*ck', 'sh*t', 'b*tch', 'a$$', 'fck', 'fuk', 'sht', 'btch',
  // Add more as needed
]

// Spam indicators
const spamPatterns = [
  /https?:\/\//gi, // URLs
  /www\./gi, // Website addresses
  /@\w+\.\w+/gi, // Email patterns
  /\d{10,}/g, // Long number sequences (phone numbers)
  /\b(viagra|cialis|poker|casino|lottery|prize|winner|claim|bitcoin|crypto)\b/gi,
  /\b(buy now|click here|limited time|act now|free money|earn money)\b/gi,
]

// Check for profanity
export function containsProfanity(text: string): { hasProfanity: boolean; words: string[] } {
  const lowerText = text.toLowerCase()
  const foundWords: string[] = []
  
  for (const word of profanityList) {
    // Check for exact word matches with word boundaries
    const regex = new RegExp(`\\b${word}\\b`, 'i')
    if (regex.test(lowerText)) {
      foundWords.push(word)
    }
  }
  
  return {
    hasProfanity: foundWords.length > 0,
    words: foundWords
  }
}

// Check for spam
export function isSpam(text: string, userName: string): { isSpam: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Check for URLs
  if (/https?:\/\//gi.test(text) || /www\./gi.test(text)) {
    reasons.push('Contains URLs')
  }
  
  // Check for email addresses
  if (/@\w+\.\w+/gi.test(text)) {
    reasons.push('Contains email addresses')
  }
  
  // Check for phone numbers (10+ digits)
  if (/\d{10,}/g.test(text.replace(/\s/g, ''))) {
    reasons.push('Contains phone numbers')
  }
  
  // Check for spam keywords
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      reasons.push('Contains spam keywords')
      break
    }
  }
  
  // Check for excessive repetition
  const words = text.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    reasons.push('Excessive word repetition')
  }
  
  // Check for excessive capital letters (more than 50%)
  const capitalCount = (text.match(/[A-Z]/g) || []).length
  const letterCount = (text.match(/[A-Za-z]/g) || []).length
  if (letterCount > 10 && capitalCount / letterCount > 0.5) {
    reasons.push('Excessive capitals (shouting)')
  }
  
  // Check for suspicious username patterns
  if (/\d{5,}/.test(userName) || userName.length < 2) {
    reasons.push('Suspicious username')
  }
  
  return {
    isSpam: reasons.length > 0,
    reasons
  }
}

// Clean text by removing profanity (replace with asterisks)
export function cleanProfanity(text: string): string {
  let cleanedText = text
  
  for (const word of profanityList) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    cleanedText = cleanedText.replace(regex, (match) => {
      return '*'.repeat(match.length)
    })
  }
  
  return cleanedText
}

// Validate review content
export function validateReviewContent(
  userName: string,
  message: string
): { valid: boolean; error?: string } {
  // Check profanity
  const profanityCheck = containsProfanity(message)
  if (profanityCheck.hasProfanity) {
    return {
      valid: false,
      error: 'Your review contains inappropriate language. Please keep it professional and respectful.'
    }
  }
  
  // Check profanity in username
  const usernameProfanity = containsProfanity(userName)
  if (usernameProfanity.hasProfanity) {
    return {
      valid: false,
      error: 'Username contains inappropriate language. Please use a respectful name.'
    }
  }
  
  // Check for spam
  const spamCheck = isSpam(message, userName)
  if (spamCheck.isSpam) {
    return {
      valid: false,
      error: `Your review appears to be spam: ${spamCheck.reasons[0]}. Please write a genuine review without promotional content.`
    }
  }
  
  // Check minimum quality (at least 3 unique words)
  const words = message.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  const uniqueWords = new Set(words)
  if (uniqueWords.size < 3) {
    return {
      valid: false,
      error: 'Please write a more detailed review with at least a few different words.'
    }
  }
  
  return { valid: true }
}

