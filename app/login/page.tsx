'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [coords, setCoords] = useState<{ x: number; y: number }[]>([])
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (coords.length >= 5) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCoords([...coords, { x, y }])
    }

    const handleLogin = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, coords }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (res.ok) {
            setTimeout(() => {
                router.replace('/dashboard')
            }, 100)
        } else {
            const data = await res.json()
            setMessage(data.error)
        }
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Image
                src="/security.jpg"
                alt="Security"
                width={400}
                height={300}
                className="border cursor-crosshair"
                onClick={handleClick}
            />
            <p>Clicks: {coords.length}/5</p>
            <Button onClick={handleLogin} disabled={coords.length !== 5}>Login</Button>
            {message && <p>{message}</p>}
        </div>
    )
}
