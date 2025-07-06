"use client"

import React, { useEffect, useState } from 'react'
import { LinkComponent } from './LinkComponent'
import { BookCheckIcon, HomeIcon, RouteIcon, TrophyIcon, StoreIcon, WalletIcon } from 'lucide-react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useCreateUser, useGetUserById, useGetUsers } from '@/app/hooks/useUserHooks'
import { API_URL, LOGO_BASE64 } from '@/app/config'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import Link from 'next/link'


export function Header() {
  const [checked, setUserChecked] = useState(false);
  const account = useAppKitAccount();
  const { open } = useAppKit();

  const createUser = useCreateUser();
  const currentUser = useGetUserById();

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
      <Link href='/' className='flex flex-row items-center space-x-4 py-2'>
        <img src={LOGO_BASE64} width={40} height={40} />
        <h1 className="text-xl font-extrabold">Lingua Chain</h1>
      </Link>
      {account.isConnected &&
        <div className='flex gap-2 items-center'>


          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105' href='/dashboard'>
                  <span className='text-lg font-bold'><HomeIcon width={20} height={20} /></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105' href='/marketplace'>
                  <span className='text-lg font-bold'><StoreIcon width={20} height={20} /></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Marketplace</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105' href='/certificate'>
                  <span className='text-lg font-bold'><BookCheckIcon width={20} height={20} /></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Certificate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105' href='/learning-path'>
                  <span className='text-lg font-bold'><RouteIcon width={20} height={20} /></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Lessons</p>
              </TooltipContent>
            </Tooltip>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Link className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105' href='/leaderboard'>
                  <span className='text-lg font-bold'><TrophyIcon width={20} height={20} /></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Leaderboard</p>
              </TooltipContent>
            </Tooltip> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => open()} className='cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg p-1 hover:scale-105'>
                  <span className='text-lg font-bold'><WalletIcon width={20} height={20} /></span>
                </button>
              </TooltipTrigger>
              <TooltipContent className='border-none'>
                <p>Wallet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {currentUser && currentUser.data && currentUser.data.equippedAvatar && currentUser.data.equippedAvatar.avatar &&
            <img className='w-8 h-8 rounded-xl' src={API_URL + currentUser.data.equippedAvatar.avatar.imageUrl} />}
        </div>}
    </header>
  )
}
