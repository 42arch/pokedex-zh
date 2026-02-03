import Image from '@/components/image'

export default function IndexPage() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center px-5 pb-8 pt-2 md:px-8">
      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <Image src="/logo.png" alt="logo" width={80} height={80} />
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tighter">
          宝可梦中文图鉴
        </h1>
        <h2 className="mt-2 text-lg font-light text-foreground">
          快速查询，随时了解你的宝可梦伙伴！
        </h2>
      </div>
      <div className="mt-8 flex w-full flex-col items-center justify-evenly gap-4 lg:gap-6">
        <Image src="/wechat.jpg" alt="微信小程序" width={200} height={200} />
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-base">我们开发了微信小程序版的宝可梦中文图鉴，欢迎扫码访问！</h3>
          <h3 className="text-base">或者微信搜索“训练家口袋图鉴”，功能更全，更新更及时！</h3>
        </div>
      </div>
    </main>
  )
}
