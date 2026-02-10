import { NextResponse } from "next/server";

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const maxwidth = searchParams.get("maxwidth") || "800";

    if (!ref) {
      return NextResponse.json({ error: "Missing photo reference" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? '';
    if (!apiKey) {
      console.error('[API_ERROR]', { 
        route: '/api/photo', 
        error: 'GOOGLE_PLACES_API_KEY is missing' 
      })
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/photo` +
      `?maxwidth=${maxwidth}&photo_reference=${encodeURIComponent(ref)}&key=${apiKey}`;

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.error('[API_ERROR]', { 
        route: '/api/photo', 
        error: `Upstream error: ${res.status}` 
      })
      return NextResponse.json({ error: "Upstream error: " + res.status }, { status: 502 });
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/photo', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
