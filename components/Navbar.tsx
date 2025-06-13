import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import Image from 'next/image'

const Navbar = () => {
    return (
        <div className='fixed flex w-full border-b border-b-white/20 px-4 py-2 justify-between items-center bg-white/5'>
            <Link href="/" className='flex items-center gap-2'>
                <Image src="/logo.png" alt="logo" width={40} height={40} />
                <h1 className='text-xl font-semibold'>Visual Lock Security</h1>
            </Link>

            <div className='flex items-center gap-2'>
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
                <ThemeToggle />
            </div>
        </div>
    )
}

export default Navbar