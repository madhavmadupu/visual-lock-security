import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
    const { username, coords } = await req.json()

    if (!username || coords?.length !== 5)
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const BUFFER = 50
    const isMatch = user.passwordCoords.every((coord: any, i: number) => {
        const dx = Math.abs(coord.x - coords[i].x)
        const dy = Math.abs(coord.y - coords[i].y)
        return dx <= BUFFER && dy <= BUFFER
    })

    if (!isMatch) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })

    const token = await signToken({ username })

    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })

    return response
}
