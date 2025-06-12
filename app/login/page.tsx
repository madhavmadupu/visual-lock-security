'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const saved = JSON.parse(localStorage.getItem('graphical_password') || '{}')
        if (typeof saved.x !== 'number' || typeof saved.y !== 'number') {
            setMessage('No password set.')
            return
        }

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const dx = Math.abs(x - saved.x)
        const dy = Math.abs(y - saved.y)

        const buffer = 50 // Allow a margin of 50 pixels

        if (dx <= buffer && dy <= buffer) {
            setMessage('✅ Login successful!')
            setTimeout(() => router.push('/dashboard'), 1000)
        } else {
            setMessage('❌ Incorrect click location.')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login: Click where you set password</h1>
            <Image
                src="/security.jpg"
                width={400}
                height={300}
                alt="Graphical Password"
                className="border"
                onClick={handleClick}
            />
            <p className="mt-4 text-center">{message}</p>
        </div>
    )
}
