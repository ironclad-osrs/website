import { NextResponse } from 'next/server'
import pick from 'just-pick'

import { getUserFromApiKey } from '@/actions/get-user-from-api-key'

export const GET = async (request) => {
  const user = await getUserFromApiKey(request)

  if (!user) {
    return NextResponse.json(null, { status: 403 })
  }

  return NextResponse.json({ user: pick(user, ['name']) })
}
