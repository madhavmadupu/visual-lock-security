'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
            <Card>
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Register</CardTitle>
                    <p className="text-sm text-gray-500">Click on the image to register your 5 point password</p>
                </CardHeader>
                <CardContent className='flex flex-col items-center gap-4'>
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
                    <Image
                        src="/security.jpg"
                        alt="Security"
                        width={400}
                        height={300}
                        className="border cursor-crosshair rounded-lg"
                        onClick={handleClick}
                    />
                    <div className='mt-4 flex flex-col items-center gap-2 w-full'>
                        <p>Clicks: {coords.length}/5</p>
                        <Button 
                        onClick={handleRegister}
                        disabled={coords.length !== 5}
                        className='w-full'
                        >Submit</Button>
                        {message && <p>{message}</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
