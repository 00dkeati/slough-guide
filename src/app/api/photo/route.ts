import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('GOOGLE_MAPS_API_KEY environment variable is required');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoReference = searchParams.get('ref');
    const maxWidth = parseInt(searchParams.get('w') || '800');
    const maxHeight = parseInt(searchParams.get('h') || '600');

    if (!photoReference) {
      return NextResponse.json({ error: 'Photo reference is required' }, { status: 400 });
    }

    // Validate max dimensions
    if (maxWidth > 1600 || maxHeight > 1600) {
      return NextResponse.json({ error: 'Max dimensions exceeded' }, { status: 400 });
    }

    // Build Google Photos API URL
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=${maxWidth}&` +
      `maxheight=${maxHeight}&` +
      `photo_reference=${photoReference}&` +
      `key=${GOOGLE_MAPS_API_KEY}`;

    // Fetch the image from Google
    const response = await fetch(photoUrl, {
      headers: {
        'User-Agent': 'SloughGuide/1.0',
      },
    });

    if (!response.ok) {
      console.error(`Google Photos API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch photo' }, 
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800', // 1 day cache, 1 week stale
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Photo proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
