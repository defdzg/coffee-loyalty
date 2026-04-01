import { NextRequest, NextResponse } from 'next/server'

// DEV ONLY - Bypass authentication for testing
export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev login only available in development' },
      { status: 403 }
    )
  }

  try {
    // Create a mock user session
    const mockUser = {
      id: 'dev-user-' + Date.now(),
      email: 'dev@coffee.local',
      name: 'Dev User',
      image: null,
    }

    const mockLoyaltyCard = {
      id: 'dev-card-' + Date.now(),
      userId: mockUser.id,
      stamps: 3, // Give them 3 stamps to start
      rewardThreshold: 9,
      rewardAvailable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in session (simplified for dev)
    const response = NextResponse.json({
      success: true,
      user: mockUser,
      loyaltyCard: mockLoyaltyCard,
    })

    // Set a simple session cookie
    response.cookies.set('dev-session', JSON.stringify(mockUser), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json(
      { error: 'Failed to create dev session' },
      { status: 500 }
    )
  }
}
