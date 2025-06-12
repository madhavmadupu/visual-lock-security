'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Register() {
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCoords({ x, y })

        localStorage.setItem('graphical_password', JSON.stringify({ x, y }))
        alert(`Password saved at X: ${Math.floor(x)}, Y: ${Math.floor(y)}`)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Register: Click to set password</h1>
            <Image
                src="/security.jpg"
                width={400}
                height={300}
                alt="Graphical Password"
                className="border"
                onClick={handleClick}
            />
        </div>
    )
}
