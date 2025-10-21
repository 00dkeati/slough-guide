'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function DataRefreshPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    summary?: {
      totalPlacesAdded: number;
      totalPlacesUpdated: number;
      totalErrors: number;
      categoriesProcessed: number;
      neighbourhoodsProcessed: number;
      duration: number;
    };
    errors?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerRefresh = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/public-refresh', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to refresh data');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Slough Guide Data Refresh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Click the button below to fetch all Slough businesses from Google Places API.
              This will populate your site with restaurants, shops, services, and more.
            </p>
            
            <Button 
              onClick={triggerRefresh} 
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching Slough Businesses...
                </>
              ) : (
                'Start Data Refresh'
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-medium text-green-800">Success!</h3>
              </div>
              
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>Status:</strong> {result.success ? 'Completed' : 'Failed'}</p>
                <p><strong>Message:</strong> {result.message}</p>
                
                {result.summary && (
                  <div className="mt-3 p-3 bg-green-100 rounded">
                    <h4 className="font-medium mb-2">Summary:</h4>
                    <ul className="space-y-1">
                      <li>• Places Added: {result.summary.totalPlacesAdded}</li>
                      <li>• Places Updated: {result.summary.totalPlacesUpdated}</li>
                      <li>• Categories Processed: {result.summary.categoriesProcessed}</li>
                      <li>• Neighbourhoods Processed: {result.summary.neighbourhoodsProcessed}</li>
                      <li>• Duration: {Math.round(result.summary.duration / 1000)}s</li>
                      <li>• Errors: {result.summary.totalErrors}</li>
                    </ul>
                  </div>
                )}
                
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-100 rounded">
                    <h4 className="font-medium mb-2">Errors:</h4>
                    <ul className="space-y-1 text-xs">
                      {result.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>This process typically takes 5-10 minutes to complete.</p>
            <p>Once finished, refresh your homepage to see the businesses!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
