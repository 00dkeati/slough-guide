import { NextRequest, NextResponse } from 'next/server';
import { addBulkBusinesses } from '../../../jobs/bulk-business-addition';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = body.count || 500;
    const secret = body.secret;

    // Verify secret token
    if (secret !== process.env.REFRESH_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`🚀 API: Starting bulk business addition for ${count} businesses`);

    const result = await addBulkBusinesses(count);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully added ${result.businessesAdded} businesses`,
        summary: result.summary,
        errors: result.errors
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bulk business addition failed',
          errors: result.errors
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bulk business addition endpoint',
    usage: 'POST with { "count": 500, "secret": "your_secret_token" }',
    example: {
      count: 500,
      secret: 'your_secret_token'
    }
  });
}
