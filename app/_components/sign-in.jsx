import { ArrowUpRight } from 'lucide-react'

import { signIn } from '@/actions/sign-in'

import { Button } from '@/components/button'

export const SignIn = () => (
  <form action={signIn}>
    <Button>
      <span>Sign in with Discord</span>
      <ArrowUpRight className='size-4' />
    </Button>
  </form>
)
