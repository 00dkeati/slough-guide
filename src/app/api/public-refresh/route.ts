import { NextResponse } from 'next/server';
import { refreshAllData } from '@/jobs/refresh-all';

// Public endpoint for data refresh (no authentication required)
export async function GET() {
  try {
    console.log('Starting public data refresh...');
    
    // Start the refresh process
    const result = await refreshAllData({
      includeNeighbourhoods: true,
      concurrency: 3,
      clearExisting: false,
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Data refresh completed successfully!' : 'Data refresh failed',
      summary: result.summary,
      errors: result.errors.slice(0, 10), // Limit errors in response
    });

  } catch (error) {
    console.error('Public refresh error:', error);
    return NextResponse.json({
      success: false,
      message: `Error: ${error}`,
      summary: null,
      errors: [String(error)],
    }, { status: 500 });
  }
}
