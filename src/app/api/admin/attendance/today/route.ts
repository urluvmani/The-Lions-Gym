import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { differenceInDays } from 'date-fns'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const attendance = await db.collection('attendance')
      .find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
      .sort({ checkIn: -1 })
      .toArray()

    const memberIds = attendance.map(a => a.memberId)
    const members = await db.collection('members')
      .find({ _id: { $in: memberIds } })
      .toArray()

    const memberMap = new Map(members.map(m => [m._id.toString(), m]))

    const formattedAttendance = attendance.map((record) => {
      const member = memberMap.get(record.memberId.toString())
      const daysLeft = member ? differenceInDays(new Date(member.expiryDate), new Date()) : 0
      
      let membershipStatus = 'Active'
      let statusColor = 'bg-green-500/10 text-green-500'
      
      if (daysLeft < 0) {
        membershipStatus = 'Expired'
        statusColor = 'bg-red-500/10 text-red-500'
      } else if (daysLeft <= 7) {
        membershipStatus = `Expiring in ${daysLeft} days`
        statusColor = 'bg-yellow-500/10 text-yellow-500'
      }

      return {
        id: record._id,
        memberName: member?.name || 'Unknown',
        memberCode: member?.code || 'Unknown',
        memberImage: member?.image || null,
        checkIn: record.checkIn,
        expiryDate: member?.expiryDate,
        membershipStatus,
        statusColor
      }
    })

    return NextResponse.json(formattedAttendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}
