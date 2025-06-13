'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        window.location.href = '/login'
    }

    return <Button size='icon' variant={"outline"} aria-label="Logout" onClick={handleLogout}>
        <LogOut
            className="mr-2 h-4 w-4"
            aria-hidden="true"
        />
    </Button>
}
