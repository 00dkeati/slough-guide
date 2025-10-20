import { NextRequest, NextResponse } from 'next/server';
import { refreshAllData } from '@/jobs/refresh-all';

// Vercel Cron Job endpoint
export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting scheduled data refresh...');
    
    const result = await refreshAllData({
      includeNeighbourhoods: true,
      concurrency: 3,
      clearExisting: false,
    });

    if (result.success) {
      console.log('Scheduled refresh completed successfully');
      return NextResponse.json({
        success: true,
        message: 'Scheduled refresh completed',
        summary: result.summary,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Scheduled refresh failed:', result.errors);
      return NextResponse.json({
        success: false,
        message: 'Scheduled refresh failed',
        errors: result.errors,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({
      success: false,
      error: 'Cron job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
