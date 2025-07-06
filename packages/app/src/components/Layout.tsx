"use client"

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Header } from './Header'
import { useGetUserProgressAll } from '@/app/hooks/useUserProgressHooks'
import { usePathname, useRouter } from 'next/navigation'
import { useCreateUser, useGetUserById } from '@/app/hooks/useUserHooks'
import { Footer } from './Footer'

export function Layout(props: PropsWithChildren) {
  const [equipSent, setEquipSent] = useState(false);
  const navigate = useRouter();
  const pathname = usePathname()
  const progressResponse = useGetUserProgressAll();
  const currentUser = useGetUserById();
  const mutation = useCreateUser();

  useEffect(() => {
    if (pathname === '/placement-test') return;
    if (progressResponse.isSuccess && (!progressResponse.data || progressResponse.data.length === 0)) {
      navigate.push('/placement-test')
    }
  }, [progressResponse])

  useEffect(() => {
    if (equipSent) return;
    if (currentUser && currentUser.data && currentUser.data.equippedAvatar == null) {
      setEquipSent(true);
      mutation.mutate({ walletAddress: currentUser.data.walletAddress })
    }
  }, [currentUser])

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      {props.children}

      <Footer />
    </div>
  )
}
