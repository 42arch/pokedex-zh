import Link from 'next/link'
import Image from 'next/image'

export default function IndexPage() {
  return (
    <main className='flex min-h-[calc(100vh-65px)] flex-col items-center px-5 pb-8 pt-2 md:px-8'>
      <div className='mt-10 flex flex-col items-center justify-center text-center'>
        <Image src='/logo.png' alt='logo' width={80} height={80} />
        <h1 className='mt-6 text-4xl font-bold leading-tight tracking-tighter'>
          宝可梦中文图鉴
        </h1>
        <h2 className='mt-2 text-lg font-light text-foreground'>
          快速查询，随时了解你的宝可梦伙伴！
        </h2>
      </div>
      <div className='mt-8 flex w-full flex-col items-center justify-evenly gap-4 lg:gap-6'>
        <NavItem title='全国图鉴' href='/pokemon' />
        <NavItem title='特性' href='/ability' />
        <NavItem title='招式' href='/move' />
        <NavItem title='道具' href='/item' />
      </div>
    </main>
  )
}

function NavItem({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className='flex h-16 w-full max-w-lg items-center justify-center gap-4 rounded-lg border px-4 py-3 text-center transition-all hover:bg-accent'
    >
      {title}
    </Link>
  )
}
