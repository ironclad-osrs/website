import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth'

import { Wrapper } from '@/components/wrapper'
import { Logo } from '@/components/logo'
import { Button } from '@/components/button'

import { SignIn } from './_components/sign-in'
import { SignOut } from './_components/sign-out'

const Page = async () => {
  const session = await auth()

  return (
    <main className='flex h-full flex-col items-start justify-end gap-4 p-8'>
      <Wrapper className='mx-0 space-y-4 px-0'>
        <Logo />
        <p>
          Ironclad clan goals reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {!session?.user && <SignIn />}
        {session?.user && (
          <div className='flex gap-4'>
            <Link href='/dashboard'>
              <Button>
                <span>Continue</span>
                <ArrowRight className='size-4' />
              </Button>
            </Link>
            <SignOut />
          </div>
        )}
      </Wrapper>
    </main>
  )
}

export default Page
