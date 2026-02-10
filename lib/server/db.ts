import { createClient } from '@libsql/client'

// Centralized database client - lazy initialization
let client: any = null

function getClient() {
  if (!client) {
    const databaseUrl = process.env.TURSO_DATABASE_URL ?? ''
    const authToken = process.env.TURSO_AUTH_TOKEN ?? ''
    
    // Only create client if we have valid credentials
    if (databaseUrl && authToken) {
      client = createClient({
        url: databaseUrl,
        authToken: authToken,
      })
    } else {
      // Return a mock client for build time
      client = {
        execute: async () => {
          throw new Error('Database not configured')
        }
      }
    }
  }
  return client
}

// Check if required environment variables are present
if (!process.env.TURSO_DATABASE_URL) {
  console.error('[DB_ERROR] TURSO_DATABASE_URL is missing')
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.error('[DB_ERROR] TURSO_AUTH_TOKEN is missing')
}

// Database ping function for health checks
export async function dbPing(): Promise<boolean> {
  try {
    const dbClient = getClient()
    await dbClient.execute('SELECT 1')
    return true
  } catch (error) {
    console.error('[DB_PING_ERROR]', error)
    return false
  }
}

// Export the client getter for use in other modules
export { getClient }
export default getClient
