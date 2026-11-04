import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const totalMembers = await db.collection('members').countDocuments({ isActive: true })

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const todayAttendance = await db.collection('attendance').countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })

    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const expiringMembers = await db.collection('members').countDocuments({
      isActive: true,
      expiryDate: { $lte: sevenDaysFromNow }
    })

    const startOfCurrentMonth = startOfMonth(new Date())
    const endOfCurrentMonth = endOfMonth(new Date())

    const membersJoinedThisMonth = await db.collection('members').find({
      dateJoined: {
        $gte: startOfCurrentMonth,
        $lte: endOfCurrentMonth
      }
    }).toArray()

    const monthlyRevenue = membersJoinedThisMonth.reduce(
      (sum, member) => sum + (member.feePaid || 0),
      0
    )

    return NextResponse.json({
      totalMembers,
      todayAttendance,
      expiringMembers,
      monthlyRevenue
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
