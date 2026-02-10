import { NextRequest, NextResponse } from 'next/server';

interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  photoCount: number;
  categories: string[];
  hasWebsite: boolean;
  websiteUrl: string | null;
  phone: string | null;
  hasHours: boolean;
  hours: string[];
  isOpen: boolean | null;
  recentReviews: {
    rating: number;
    text: string;
    time: string;
    authorName: string;
  }[];
  priceLevel: number | null;
  totalPhotos: number;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  icon: string;
}

function calculateScore(data: PlaceDetails): number {
  let score = 0;

  // Rating (25 points max)
  if (data.rating) {
    score += Math.min(25, (data.rating / 5) * 25);
  }

  // Review count (25 points max)
  if (data.reviewCount >= 100) score += 25;
  else if (data.reviewCount >= 50) score += 20;
  else if (data.reviewCount >= 20) score += 15;
  else if (data.reviewCount >= 10) score += 10;
  else if (data.reviewCount >= 5) score += 5;

  // Photos (15 points max)
  if (data.photoCount >= 20) score += 15;
  else if (data.photoCount >= 10) score += 12;
  else if (data.photoCount >= 5) score += 8;
  else if (data.photoCount >= 1) score += 4;

  // Website (10 points)
  if (data.hasWebsite) score += 10;

  // Phone (5 points)
  if (data.phone) score += 5;

  // Hours (10 points)
  if (data.hasHours) score += 10;

  // Categories (10 points max)
  if (data.categories.length >= 3) score += 10;
  else if (data.categories.length >= 2) score += 7;
  else if (data.categories.length >= 1) score += 4;

  return Math.round(Math.min(100, score));
}

function getGrade(score: number): { grade: string; color: string; message: string } {
  if (score >= 90) return { grade: 'A+', color: '#22c55e', message: 'Excellent! Your profile is highly optimized.' };
  if (score >= 80) return { grade: 'A', color: '#22c55e', message: 'Great! Just a few tweaks needed.' };
  if (score >= 70) return { grade: 'B', color: '#84cc16', message: 'Good foundation, room for improvement.' };
  if (score >= 60) return { grade: 'C', color: '#eab308', message: 'Average. Several opportunities to improve.' };
  if (score >= 50) return { grade: 'D', color: '#f97316', message: 'Below average. Needs significant work.' };
  return { grade: 'F', color: '#ef4444', message: 'Critical! Your profile needs immediate attention.' };
}

function generateRecommendations(data: PlaceDetails): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Review count recommendations
  if (data.reviewCount < 10) {
    recommendations.push({
      priority: 'high',
      title: 'Get More Reviews',
      description: `You only have ${data.reviewCount} reviews. Businesses with 20+ reviews get 3x more clicks. Ask happy customers to leave a review - send them a direct link to your Google profile.`,
      impact: '+40% more customer enquiries',
      icon: 'star'
    });
  } else if (data.reviewCount < 30) {
    recommendations.push({
      priority: 'medium',
      title: 'Build Your Review Count',
      description: `${data.reviewCount} reviews is a good start, but competitors with 50+ reviews rank higher. Create a simple "leave us a review" card to give customers.`,
      impact: '+25% visibility boost',
      icon: 'star'
    });
  }

  // Rating recommendations
  if (data.rating && data.rating < 4.5) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Your Rating',
      description: `Your ${data.rating}-star rating is hurting your visibility. Respond professionally to all negative reviews - 45% of customers say they'd visit a business that responds to bad reviews.`,
      impact: 'Higher trust & click-through rate',
      icon: 'trending'
    });
  }

  // Photo recommendations
  if (data.photoCount < 5) {
    recommendations.push({
      priority: 'high',
      title: 'Add More Photos',
      description: `You only have ${data.photoCount} photos. Businesses with 10+ photos get 35% more clicks. Add photos of your work, team, premises, and before/after shots.`,
      impact: '+35% more profile views',
      icon: 'camera'
    });
  } else if (data.photoCount < 15) {
    recommendations.push({
      priority: 'medium',
      title: 'Expand Your Photo Gallery',
      description: `${data.photoCount} photos is decent. Add more variety: team photos, action shots, finished work. Google rewards fresh content - add new photos monthly.`,
      impact: '+20% engagement',
      icon: 'camera'
    });
  }

  // Website recommendation
  if (!data.hasWebsite) {
    recommendations.push({
      priority: 'high',
      title: 'Add Your Website',
      description: 'No website linked! Businesses with websites get 50% more leads. If you don\'t have one, even a simple Facebook page is better than nothing.',
      impact: '+50% more leads',
      icon: 'globe'
    });
  }

  // Hours recommendation
  if (!data.hasHours) {
    recommendations.push({
      priority: 'medium',
      title: 'Set Your Business Hours',
      description: 'Your opening hours aren\'t set. Customers often filter by "open now" - if your hours aren\'t listed, you won\'t appear in these searches.',
      impact: 'Appear in "open now" searches',
      icon: 'clock'
    });
  }

  // Review response recommendation
  const unrepliedBadReviews = data.recentReviews?.filter(r => r.rating <= 3) || [];
  if (unrepliedBadReviews.length > 0) {
    recommendations.push({
      priority: 'high',
      title: 'Respond to Negative Reviews',
      description: `You have ${unrepliedBadReviews.length} review(s) rated 3 stars or below. Responding professionally shows you care and can turn critics into fans. 89% of consumers read business responses.`,
      impact: 'Recover reputation & show you care',
      icon: 'message'
    });
  }

  // Category recommendations
  if (data.categories.length < 2) {
    recommendations.push({
      priority: 'medium',
      title: 'Add More Categories',
      description: 'You only have one business category. Adding relevant secondary categories (up to 10) helps you appear in more search types.',
      impact: 'Appear in more search results',
      icon: 'users'
    });
  }

  // Phone recommendation
  if (!data.phone) {
    recommendations.push({
      priority: 'medium',
      title: 'Add Phone Number',
      description: 'No phone number listed. Mobile users often tap-to-call directly from Google - you\'re missing these leads.',
      impact: 'Enable tap-to-call leads',
      icon: 'phone'
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Return top 5
  return recommendations.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const { placeData } = await request.json();

    if (!placeData) {
      return NextResponse.json(
        { error: 'Place data is required' },
        { status: 400 }
      );
    }

    const score = calculateScore(placeData);
    const { grade, color, message } = getGrade(score);
    const recommendations = generateRecommendations(placeData);

    return NextResponse.json({
      success: true,
      analysis: {
        score,
        grade,
        gradeColor: color,
        gradeMessage: message,
        recommendations,
        businessName: placeData.name
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze business profile' },
      { status: 500 }
    );
  }
}
