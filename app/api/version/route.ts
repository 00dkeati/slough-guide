import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "local"
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "unknown"
  const now = new Date().toISOString()
  
  return NextResponse.json({
    sha,
    branch,
    now,
    deployment: {
      sha,
      branch,
      timestamp: now
    }
  })
}
