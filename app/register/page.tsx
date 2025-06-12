'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Image from 'next/image'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [coords, setCoords] = useState<{ x: number; y: number }[]>([])
    const [message, setMessage] = useState('')

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (coords.length >= 5) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCoords([...coords, { x, y }])
    }

    const handleRegister = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, coords }),
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        setMessage(data.message || data.error)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Register</h1>
            <Input placeholder="Username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            <Image
                src="/security.jpg"
                alt="Security"
                width={400}
                height={300}
                className="border cursor-crosshair"
                onClick={handleClick}
            />
            <p>Clicks: {coords.length}/5</p>
            <Button onClick={handleRegister} disabled={coords.length !== 5}>Submit</Button>
            {message && <p>{message}</p>}
        </div>
    )
}
