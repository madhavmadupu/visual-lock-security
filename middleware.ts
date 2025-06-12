import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value
    const url = req.nextUrl.pathname

    const isAuthPage = url === '/login' || url === '/register'
    const isProtected = url.startsWith('/dashboard')
    
    const user = token
    
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
    
    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return NextResponse.next()
}
