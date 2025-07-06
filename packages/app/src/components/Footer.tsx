import React from 'react'
import { SITE_EMOJI, SITE_INFO, SOCIAL_GITHUB, SOCIAL_TWITTER } from '@/utils/site'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { NetworkStatus } from './NetworkStatus'
import { LinkComponent } from './LinkComponent'
import { LOGO_BASE64 } from '@/app/config'

export function Footer() {
  return (
    <>
      <footer className='sticky top-[100vh] footer flex justify-between items-center bg-gradient-to-br from-[#101622] via-[#1b2432] to-[#11141c] text-neutral-content p-4'>
        <p className='flex flex-row items-center space-x-2 text-sm'>
          <img src={LOGO_BASE64} width={16} height={16} />
          Made with ❤️ in ETHGLobal Cannes
        </p>
        <div className='flex gap-4'>
          <LinkComponent href={`https://github.com/${SOCIAL_GITHUB}`}>
            <FaGithub />
          </LinkComponent>
          <LinkComponent href={`https://twitter.com/${SOCIAL_TWITTER}`}>
            <FaXTwitter />
          </LinkComponent>
        </div>
      </footer>
    </>
  )
}
