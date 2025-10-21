import { NextRequest, NextResponse } from 'next/server';
import { refreshAllData } from '@/jobs/refresh-all';
import { cache } from '@/lib/cache';

const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Check for secret token in header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!REFRESH_SECRET_TOKEN || token !== REFRESH_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Parse request body for options
    const body = await request.json().catch(() => ({}));
    const {
      includeNeighbourhoods = true,
      concurrency = 3,
      clearExisting = false
    } = body;

    console.log('Starting data refresh via API...');
    
    const result = await refreshAllData({
      includeNeighbourhoods,
      concurrency,
      clearExisting,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Data refresh completed successfully',
        summary: result.summary,
        errors: result.errors,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Data refresh failed',
        summary: result.summary,
        errors: result.errors,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Refresh API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Refresh endpoint is available',
    timestamp: new Date().toISOString(),
  });
}
