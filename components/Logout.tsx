'use client'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        window.location.href = '/login'
    }

    return <Button onClick={handleLogout}>Logout</Button>
}
