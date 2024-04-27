import { Logo } from '@/components/logo.jsx'

const Page = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4'>
      <Logo />
      <p className='font-mono text-xs'>Please use the API to interact with this service.</p>
    </div>
  )
}

export default Page
