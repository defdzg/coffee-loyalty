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

    // Rate limiting: check last stamp time
    const lastStamp = await prisma.transaction.findFirst({
      where: {
        userId,
        type: 'stamp',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (lastStamp) {
      const timeSinceLastStamp = Date.now() - lastStamp.createdAt.getTime()
      const cooldownMs = 30 * 1000 // 30 seconds cooldown
      
      if (timeSinceLastStamp < cooldownMs) {
        return NextResponse.json(
          { error: 'Please wait before adding another stamp' },
          { status: 429 }
        )
      }
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

    // Update stamps
    const newStamps = loyaltyCard.stamps + 1
    const rewardAvailable = newStamps >= loyaltyCard.rewardThreshold

    const updatedCard = await prisma.$transaction(async (tx) => {
      // Create transaction
      await tx.transaction.create({
        data: {
          userId,
          type: 'stamp',
        },
      })

      // Update loyalty card
      return tx.loyaltyCard.update({
        where: { userId },
        data: {
          stamps: newStamps,
          rewardAvailable,
        },
      })
    })

    return NextResponse.json({
      success: true,
      loyaltyCard: updatedCard,
    })
  } catch (error) {
    console.error('Error adding stamp:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
