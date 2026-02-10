import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Slough.co — Local Directory & News'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'white',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              W
            </span>
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Slough.co
          </span>
        </div>

        {/* Main Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 24px 0',
              lineHeight: '1.1',
            }}
          >
            Local Directory & News
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              lineHeight: '1.4',
            }}
          >
            Find trusted local businesses and stay informed about your community
          </p>
        </div>

        {/* Trust Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '60px',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            500+ Businesses
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            270+ Reviews
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: '20px',
            }}
          >
            <span style={{ marginRight: '8px' }}>✓</span>
            Updated Daily
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
