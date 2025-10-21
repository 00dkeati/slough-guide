import { NextResponse } from 'next/server';

export async function GET() {
  // Debug endpoint to check environment variables
  const envVars = {
    Google_places_api: process.env.Google_places_api ? 'SET' : 'NOT SET',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET',
    // Show first few characters of the actual key (for debugging)
    Google_places_api_VALUE: process.env.Google_places_api ? 
      process.env.Google_places_api.substring(0, 10) + '...' : 'NOT SET',
  };

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('GOOGLE') || key.includes('API')
    ),
  });
}
