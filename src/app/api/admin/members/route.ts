import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const members = await db.collection('members')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const planType = formData.get('planType') as string
    const feePaid = parseFloat(formData.get('feePaid') as string)
    const image = formData.get('image') as File

    const durationMap: { [key: string]: number } = {
      '1 Month': 1,
      '3 Months': 3,
      '6 Months': 6,
      '1 Year': 12
    }

    const months = durationMap[planType] || 1
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + months)

    let imagePath = null
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${code.toUpperCase()}-${Date.now()}.${image.name.split('.').pop()}`
      const filePath = join(process.cwd(), 'public', 'uploads', 'members', fileName)
      await writeFile(filePath, buffer)
      imagePath = `/uploads/members/${fileName}`
    }

    const client = await clientPromise
    const db = client.db()
    const members = db.collection('members')

    const existingMember = await members.findOne({ code: code.toUpperCase() })

    if (existingMember) {
      return NextResponse.json(
        { error: 'Member with this code already exists' },
        { status: 400 }
      )
    }

    const member = await members.insertOne({
      name,
      code: code.toUpperCase(),
      phone,
      address,
      planType,
      feePaid,
      image: imagePath,
      dateJoined: new Date(),
      expiryDate,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const newMember = await members.findOne({ _id: member.insertedId })

    return NextResponse.json(newMember)
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
