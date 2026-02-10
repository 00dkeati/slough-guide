'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Star, Camera, Clock, Globe, MessageCircle, Users, 
  Phone, MapPin, Shield, TrendingUp, CheckCircle, AlertCircle,
  ArrowRight, Loader2, Building2, Zap
} from 'lucide-react';

interface PlaceData {
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
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  icon: string;
}

interface AnalysisResult {
  score: number;
  grade: string;
  gradeColor: string;
  gradeMessage: string;
  recommendations: Recommendation[];
  businessName: string;
}

const iconMap: Record<string, any> = {
  star: Star,
  camera: Camera,
  clock: Clock,
  globe: Globe,
  message: MessageCircle,
  users: Users,
  phone: Phone,
  map: MapPin,
  shield: Shield,
  trending: TrendingUp,
};

export default function GBPBoosterPage() {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPlaceData(null);
    setAnalysis(null);
    setLoading(true);

    try {
      // Step 1: Lookup business
      const lookupRes = await fetch('/api/gbp-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, location }),
      });

      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData.success) {
        setError(lookupData.error || 'Business not found');
        setLoading(false);
        return;
      }

      setPlaceData(lookupData.data);
      setLoading(false);
      setAnalyzing(true);

      // Step 2: Analyze with AI
      const analyzeRes = await fetch('/api/gbp-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeData: lookupData.data }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok || !analyzeData.success) {
        setError('Failed to analyze profile');
        setAnalyzing(false);
        return;
      }

      setAnalysis(analyzeData);
      setAnalyzing(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleCheckout = async () => {
    if (!placeData || !analysis) return;
    
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/gbp-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: placeData.name,
          placeId: placeData.placeId,
          score: analysis.score,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment setup failed. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getGradeColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100 border-green-200';
      case 'blue': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'orange': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'red': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
            ← Back to Slough.co
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Free Instant Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Google Business Profile Booster
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get a free audit of your Google Business Profile with 5 specific actions to boost your local rankings and get more customers.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Costa Coffee"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Slough"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || analyzing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding your business...
                  </>
                ) : analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Audit My Business Profile
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {placeData && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Business Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{placeData.name}</h2>
                  <p className="text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {placeData.address}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {placeData.categories.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      {placeData.rating ? placeData.rating.toFixed(1) : '—'}
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="text-sm text-gray-500">{placeData.reviewCount} reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      {placeData.photoCount}
                      <Camera className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-sm text-gray-500">photos</div>
                  </div>
                </div>
              </div>

              {/* Profile Checklist */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className={`flex items-center gap-2 ${placeData.hasWebsite ? 'text-green-600' : 'text-gray-400'}`}>
                  {placeData.hasWebsite ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm">Website</span>
                </div>
                <div className={`flex items-center gap-2 ${placeData.phone ? 'text-green-600' : 'text-gray-400'}`}>
                  {placeData.phone ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm">Phone</span>
                </div>
                <div className={`flex items-center gap-2 ${placeData.hasHours ? 'text-green-600' : 'text-gray-400'}`}>
                  {placeData.hasHours ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm">Hours Set</span>
                </div>
                <div className={`flex items-center gap-2 ${placeData.photoCount >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  {placeData.photoCount >= 10 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm">10+ Photos</span>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <>
                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 text-center">
                  <h3 className="text-lg font-medium text-gray-600 mb-4">Your Profile Score</h3>
                  <div className="flex items-center justify-center gap-6">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${getGradeColor(analysis.gradeColor)}`}>
                      <div>
                        <div className="text-5xl font-bold">{analysis.grade}</div>
                        <div className="text-2xl font-semibold">{analysis.score}/100</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-lg text-gray-700">{analysis.gradeMessage}</p>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Your 5-Point Action Plan
                  </h3>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, index) => {
                      const IconComponent = iconMap[rec.icon] || Star;
                      return (
                        <div
                          key={index}
                          className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                                  {rec.priority.toUpperCase()}
                                </span>
                                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                              <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {rec.impact}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-center text-white">
                  <h3 className="text-2xl font-bold mb-3">Want us to do this for you?</h3>
                  <p className="text-green-100 mb-6 max-w-xl mx-auto">
                    Let our team implement all 5 recommendations, optimize your photos, 
                    respond to reviews, and set up your profile for maximum visibility.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="bg-white text-green-700 hover:bg-green-50 font-bold py-4 px-8 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Get It Done — £49
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <span className="text-green-200 text-sm">One-time payment • Done within 48 hours</span>
                  </div>
                </div>
              </>
            )}

            {/* Analyzing State */}
            {analyzing && !analysis && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Analyzing your profile...</h3>
                <p className="text-gray-600 mt-2">Our AI is reviewing your photos, reviews, and profile completeness.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Benefits Section (shown before search) */}
      {!placeData && (
        <section className="py-12 px-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What You'll Get
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Profile Analysis</h3>
                <p className="text-gray-600 text-sm">
                  We pull your actual Google data and analyze every aspect of your profile.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Score & Grade</h3>
                <p className="text-gray-600 text-sm">
                  See exactly where you stand with a clear score out of 100.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">5 Quick Fixes</h3>
                <p className="text-gray-600 text-sm">
                  Get 5 specific, actionable recommendations tailored to your business.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Slough.co — Helping local businesses grow</p>
      </footer>
    </div>
  );
}
