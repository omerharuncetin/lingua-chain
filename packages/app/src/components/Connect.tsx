"use client";

import { useAppKitAccount } from '@reown/appkit/react'
import React from 'react'

export function Connect() {
  const account = useAppKitAccount();

  return (
    <div>
      {account.isConnected && 
        <w3m-button label='Connect' balance='hide' size='sm' />
      }
    </div>
  )
}
