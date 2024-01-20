"use client"

import Link from 'next/link'
import logo from '@/public/logo.png'
import Image from 'next/image'
import { ConnectKitButton } from 'connectkit';

export default function Navbar() {
    return (<div className="flex align-center justify-center w-full p-4">
            <div className='flex align-center justify-between items-center w-[80%]'>
                 <div className='w-[50%] flex  space-x-6 text-xl items-center text-blue-600'>
                    <Image src={logo} width={80} alt='zkkey logo' priority={true} />
                    <Link className='text-white' href='/permit'>Register</Link>
                </div>
            </div>
        
        <ConnectKitButton/>
        </div>);
}