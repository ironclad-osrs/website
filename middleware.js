import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { auth } from '@/auth'
import { database } from '@/services/database'
import { apiKeys } from '@/database/schema'

export const middleware = auth(async req => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/api/runelite')) {
    const header = req.headers.get('authorization') ?? ''

    if (!header) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }

    const apiKey = await database.query.apiKeys.findFirst({
      where: (apiKey, { and, eq, isNull }) => and(
        eq(apiKey.key, header),
        isNull(apiKey.archived_at)
      )
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }

    await database.update(apiKeys)
      .set({ last_used_at: new Date() })
      .where(eq(apiKeys.id, apiKey.id))
  }

  return NextResponse.next()
})
