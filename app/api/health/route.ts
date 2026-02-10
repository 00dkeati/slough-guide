import { NextResponse } from 'next/server'
import { dbPing } from '@/lib/server/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const checks = {
      database: false,
      environment: {
        TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
        TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      },
      timestamp: new Date().toISOString(),
    }

    // Only test database connection if we have environment variables
    if (checks.environment.TURSO_DATABASE_URL && checks.environment.TURSO_AUTH_TOKEN) {
      checks.database = await dbPing()
    }

    const allChecksPass = checks.database && 
      checks.environment.TURSO_DATABASE_URL && 
      checks.environment.TURSO_AUTH_TOKEN

    if (!allChecksPass) {
      console.error('[HEALTH_CHECK_FAILED]', checks)
      return NextResponse.json(checks, { status: 500 })
    }

    return NextResponse.json({
      status: 'healthy',
      ...checks,
    })

  } catch (error) {
    console.error('[HEALTH_CHECK_ERROR]', {
      error: error instanceof Error ? error.message : String(error),
    })
    
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
