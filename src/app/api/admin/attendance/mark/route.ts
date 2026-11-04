import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { differenceInDays } from 'date-fns'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Member code is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const member = await db.collection('members').findOne({
      code: code.toUpperCase()
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    if (!member.isActive) {
      return NextResponse.json(
        { error: 'Member is not active' },
        { status: 400 }
      )
    }

    const daysLeft = differenceInDays(new Date(member.expiryDate), new Date())
    let membershipWarning = null
    
    if (daysLeft < 0) {
      return NextResponse.json(
        { error: 'Membership has expired' },
        { status: 400 }
      )
    } else if (daysLeft <= 7) {
      membershipWarning = `Membership expiring in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const existingAttendance = await db.collection('attendance').findOne({
      memberId: member._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already marked for today' },
        { status: 400 }
      )
    }

    const attendance = await db.collection('attendance').insertOne({
      memberId: member._id,
      date: new Date(),
      checkIn: new Date(),
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      member: {
        name: member.name,
        code: member.code
      },
      membershipWarning
    })
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  }
}
