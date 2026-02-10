'use client'

export default function TestImages() {
  // Test image URL from our data
  const testImageUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=AciIO2do5Bvz38mDLWFpM5SCpxUF1wLjE9rKHPyXb_-_8867wl4nVjTszqQRN_Rz1vXDF4j9WLffK7S7jZup3QKPwFoeK3RCtMTc8MevfFc4ULYlCM3F345Hgo_vebv8PDrsfOb4lZEaDP9c2m7k61TQh2Rf-6G6SHYPltJopQz52n_NSJSS3779-xVOq5lZuqeVTxKuHmNN7Gxqig0iLiWWnqjPPaIqbFZ29x5A0o7FC-0doUFC8f5MmbD5OWifAUrQTGfmnsLzz15C5QUIBkniV71iG4fmP-xJh3hJYM0yJkR4Gg&key=AIzaSyB3pZBoHHpAmibsx8zT1VH6JW9_Odpm9sM"
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test 1: Direct Google Maps API Image</h2>
          <p className="text-sm text-gray-600 mb-2">URL: {testImageUrl.substring(0, 100)}...</p>
          <div className="border-2 border-blue-500 p-4">
            <img 
              src={testImageUrl}
              alt="Test image from Google Maps"
              className="w-full max-w-md h-64 object-cover"
              onLoad={() => console.log('✅ Image loaded successfully!')}
              onError={(e) => console.error('❌ Image failed to load:', e)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test 2: Direct URL (after redirect)</h2>
          <p className="text-sm text-gray-600 mb-2">This is the URL Google Maps redirects to</p>
          <div className="border-2 border-green-500 p-4">
            <img 
              src="https://lh3.googleusercontent.com/places/ANXAkqEUG2lU81BXC9bdL9Ig2OzJrp3U1r4zOO_Abe80XVWCP_2klsL70bCKBGz25_-ndGdPrT3OGlkvPOoKkOjTm21qkmrqe7o479s=s1600-w800"
              alt="Test image direct URL"
              className="w-full max-w-md h-64 object-cover"
              onLoad={() => console.log('✅ Direct URL image loaded successfully!')}
              onError={(e) => console.error('❌ Direct URL image failed to load:', e)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test 3: Control Image (Unsplash)</h2>
          <div className="border-2 border-purple-500 p-4">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400"
              alt="Control image"
              className="w-full max-w-md h-64 object-cover"
              onLoad={() => console.log('✅ Control image loaded successfully!')}
              onError={(e) => console.error('❌ Control image failed to load:', e)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open your browser's Developer Console (F12)</li>
          <li>Check the Console tab for any error messages</li>
          <li>Check the Network tab to see if images are being requested</li>
          <li>Look for any CORS or CSP errors</li>
        </ol>
      </div>
    </div>
  )
}

