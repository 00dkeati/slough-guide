import { NextResponse } from 'next/server';

export async function GET() {
  // Debug endpoint to check environment variables
  const envVars = {
    GOOGLE_PLACES_API: process.env.GOOGLE_PLACES_API ? 'SET' : 'NOT SET',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET',
    // Show first few characters of the actual key (for debugging)
    GOOGLE_PLACES_API_VALUE: process.env.GOOGLE_PLACES_API ? 
      process.env.GOOGLE_PLACES_API.substring(0, 10) + '...' : 'NOT SET',
  };

  return NextResponse.json({
    message: 'Environment variables debug',
    envVars,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('GOOGLE') || key.includes('API')
    ),
  });
}
