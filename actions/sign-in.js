'use server'

import { signIn as authSignIn } from '@/auth.js'

export const signIn = async () => {
  await authSignIn('discord')
}
