interface SafeFetchOptions extends RequestInit {
  timeout?: number
}

export async function safeJsonFetch<T = any>(
  url: string, 
  options: SafeFetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error('[FETCH_ERROR]', {
        url,
        status: response.status,
        statusText: response.statusText,
      })
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data as T
    
  } catch (error) {
    console.error('[FETCH_ERROR]', {
      url,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
