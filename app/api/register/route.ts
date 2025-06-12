import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
    const { username, coords } = await req.json()
    if (!username || coords?.length !== 5) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    await connectToDatabase()

    const exists = await User.findOne({ username })
    if (exists) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

    const user = new User({ username, passwordCoords: coords })
    await user.save()

    return NextResponse.json({ message: 'User registered successfully' })
}
