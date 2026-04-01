import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get loyalty card
    const loyaltyCard = await prisma.loyaltyCard.findUnique({
      where: { userId },
    })

    if (!loyaltyCard) {
      return NextResponse.json(
        { error: 'Loyalty card not found' },
        { status: 404 }
      )
    }

    if (!loyaltyCard.rewardAvailable) {
      return NextResponse.json(
        { error: 'No reward available' },
        { status: 400 }
      )
    }

    // Redeem reward
    const updatedCard = await prisma.$transaction(async (tx) => {
      // Create transaction
      await tx.transaction.create({
        data: {
          userId,
          type: 'redeem',
        },
      })

      // Reset loyalty card
      return tx.loyaltyCard.update({
        where: { userId },
        data: {
          stamps: 0,
          rewardAvailable: false,
        },
      })
    })

    return NextResponse.json({
      success: true,
      loyaltyCard: updatedCard,
    })
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
