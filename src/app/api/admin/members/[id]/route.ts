import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { unlink } from 'fs/promises'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const formData = await request.formData()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const planType = formData.get('planType') as string
    const feePaid = parseFloat(formData.get('feePaid') as string)
    const expiryDate = formData.get('expiryDate') as string
    const image = formData.get('image') as File
    const keepExistingImage = formData.get('keepExistingImage') === 'true'

    const client = await clientPromise
    const db = client.db()

    const existingMember = await db.collection('members').findOne({ _id: new ObjectId(resolvedParams.id) })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    let imagePath = existingMember.image

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${code.toUpperCase()}-${Date.now()}.${image.name.split('.').pop()}`
      const filePath = join(process.cwd(), 'public', 'uploads', 'members', fileName)
      await writeFile(filePath, buffer)
      imagePath = `/uploads/members/${fileName}`

      if (existingMember.image) {
        const oldFilePath = join(process.cwd(), 'public', existingMember.image)
        try {
          await unlink(oldFilePath)
        } catch (err) {
          console.error('Failed to delete old image:', err)
        }
      }
    } else if (!keepExistingImage) {
      imagePath = null
      if (existingMember.image) {
        const oldFilePath = join(process.cwd(), 'public', existingMember.image)
        try {
          await unlink(oldFilePath)
        } catch (err) {
          console.error('Failed to delete old image:', err)
        }
      }
    }

    const updateData: any = {
      name,
      code: code.toUpperCase(),
      phone,
      address,
      planType,
      feePaid,
      image: imagePath,
      updatedAt: new Date()
    }

    if (expiryDate) {
      updateData.expiryDate = new Date(expiryDate)
    }

    const result = await db.collection('members').updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      {
        $set: updateData
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const member = await db.collection('members').findOne({ _id: new ObjectId(resolvedParams.id) })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const client = await clientPromise
    const db = client.db()

    const member = await db.collection('members').findOne({ _id: new ObjectId(resolvedParams.id) })

    if (member && member.image) {
      const filePath = join(process.cwd(), 'public', member.image)
      try {
        await unlink(filePath)
      } catch (err) {
        console.error('Failed to delete image:', err)
      }
    }

    const result = await db.collection('members').deleteOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    )
  }
}
