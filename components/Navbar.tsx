import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Lock } from 'lucide-react'

const Navbar = () => {
    return (
        <div className='fixed flex w-full border-b border-b-white/20 px-4 py-2 justify-between items-center bg-white/5'>
            <Link href="/" className='flex items-center gap-2'>
                <Lock className='w-6 h-6 text-white' />
                <h1 className='text-2xl font-bold'>Visual Lock Security</h1>
            </Link>

            <div>
                <Button variant={'link'}>
                    <Link href="/login">
                        Login
                    </Link>
                </Button>
                <Button variant={'outline'}>
                    <Link href="/register">
                        Register
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default Navbar