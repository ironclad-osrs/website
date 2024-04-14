import { signOut } from '@/actions/sign-out'

import { Button } from '@/components/button'

export const SignOut = () => (
  <form action={signOut}>
    <Button theme='muted'>
      Sign out
    </Button>
  </form>
)
