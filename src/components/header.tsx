import Image from 'next/image'
import { DotsThreeOutline, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { Button } from './ui/button'
import MobileSidebar from './mobile-sidebar'
import Link from 'next/link'

export async function Header() {
  return (
    <div className='flex items-center justify-between bg-white px-7 py-3.5 dark:bg-neutral-950 sm:flex-row sm:items-center sm:space-y-0 md:h-16'>
      <div className='flex flex-shrink-0 items-center'>
        <Image width={28} height={28} src='/logo.png' alt='宝可梦图鉴logo' />
        <h1 className='pl-3 font-medium'>宝可梦图鉴</h1>
      </div>
      <div className='flex flex-shrink-0 items-center gap-2'>
        <Link href='https://github.com/42arch/pokedex-zh' target='_blank'>
          <Button className='rounded-full' variant='outline' size='icon'>
            <GithubLogo size={16} />
          </Button>
        </Link>

        <MobileSidebar>
          <Button
            className='flex rounded-full md:hidden'
            variant='outline'
            size='icon'
          >
            <DotsThreeOutline size={16} />
          </Button>
        </MobileSidebar>
      </div>
    </div>
  )
}
