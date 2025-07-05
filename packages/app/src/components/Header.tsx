"use client"

import React from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_EMOJI } from '@/utils/site'
import { Connect } from './Connect'
import { HomeIcon, NewspaperIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'


export function Header() {
  const account = useAppKitAccount();

  return (
    <header className='navbar flex justify-between p-4 pt-0 bg-gradient-to-br from-[#101622] via-[#1b2432] to-[#11141c]'>
      <Link href='/'>
        <h1 className='text-xl font-bold'>{SITE_EMOJI}</h1>
      </Link>
      {account.isConnected &&
        <div className='flex gap-2 items-center'>
          <Link href='/dashboard'>
            <span className='text-lg font-bold'><HomeIcon /></span>
          </Link>
          <Link href='/'>
            <span className='text-lg font-bold'><NewspaperIcon /></span>
          </Link>
          <Link href='/'>
            <span className='text-lg font-bold'><ChartBarSquareIcon /></span>
          </Link>
          <Connect />
        </div>}
    </header>
  )
}
