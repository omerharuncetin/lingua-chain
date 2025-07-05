"use client"

import React, { useEffect, useState } from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_EMOJI } from '@/utils/site'
import { Connect } from './Connect'
import { HomeIcon, NewspaperIcon, ChartBarSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'
import { useCreateUser, useGetUsers } from '@/app/hooks/useUserHooks'


export function Header() {
  const [checked, setUserChecked] = useState(false);
  const account = useAppKitAccount();

  const createUser = useCreateUser();

  const users = useGetUsers(account.address?.toLowerCase());

  useEffect(() => {
    if (account.address && !checked && users.data?.length == 0) {
      createUser.mutateAsync({
        walletAddress: account.address,
        username: 'best username'
      })
      setUserChecked(true);
    }
  }, [account])

  return (
    <header className='navbar flex justify-between p-4 pt-0 bg-gradient-to-br from-[#101622] via-[#1b2432] to-[#11141c]'>
      <LinkComponent href='/'>
        <h1 className='text-xl font-bold'>{SITE_EMOJI}</h1>
      </LinkComponent>
      {account.isConnected &&
        <div className='flex gap-2 items-center'>
          <LinkComponent href='/dashboard'>
            <span className='text-lg font-bold'>🏠</span>
          </LinkComponent>
          <LinkComponent href='/'>
            <span className='text-lg font-bold'>📰</span>
          </LinkComponent>
          <LinkComponent href='/learning-path'>
            <span className='text-lg font-bold'>📜</span>
          </LinkComponent>
          <LinkComponent href='/'>
            <span className='text-lg font-bold'>📊</span>
          </LinkComponent>
          <Connect />
        </div>}
    </header>
  )
}
