import { redirect } from 'next/navigation'

import { auth } from '@/auth'

import { Logo } from '@/components/logo'
import { Wrapper } from '@/components/wrapper'

import { CurrentUser } from './_components/current-user'
import Link from 'next/link'

const AuthLayout = async ({ children }) => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/')
  }

  return (
    <Wrapper>
      <nav className='flex items-center gap-4 pt-4 text-sm'>
        <Link className='block' href='/dashboard'>
          <Logo />
        </Link>
        <a className='flex items-center gap-2'>
          <img src='/skills/overall.png' className='size-4' />
          <span>Goals</span>
        </a>
        <CurrentUser user={session.user?.name} />
      </nav>
      {children}
    </Wrapper>
  )
}

export default AuthLayout
