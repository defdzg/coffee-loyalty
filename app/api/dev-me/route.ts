import { NextRequest, NextResponse } from 'next/server'

// DEV ONLY - Mock /api/me endpoint that doesn't require database
export async function GET(req: NextRequest) {
  // Try to get dev session
  const devSession = req.cookies.get('dev-session')

  if (devSession) {
    try {
      const user = JSON.parse(devSession.value)
      
      // Return mock user data with loyalty card
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        loyaltyCard: {
          id: 'dev-card-123',
          userId: user.id,
          stamps: 3,
          rewardThreshold: 9,
          rewardAvailable: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        recentTransactions: [
          {
            id: 'tx-1',
            userId: user.id,
            type: 'stamp',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: 'tx-2',
            userId: user.id,
            type: 'stamp',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
        ],
      })
    } catch (error) {
      console.error('Error parsing dev session:', error)
    }
  }

  // If no dev session, fall through to database (will error without DB)
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
}
