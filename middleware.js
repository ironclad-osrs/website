import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { verifyKey } from 'discord-interactions'

import { database } from '@/services/database'
import { apiKeys } from '@/database/schema'

export const middleware = async req => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/api/cron')) {
    const header = req.headers.get('authorization') ?? ''

    if (header !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }
  }

  // Authenticate with RuneLite API keys
  if (pathname.startsWith('/api/runelite')) {
    const header = req.headers.get('authorization') ?? ''

    if (!header) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }

    const apiKey = await database().then(d => d.query.apiKeys
      .findFirst({
        where: (apiKey, { and, eq, isNull }) => and(
          eq(apiKey.key, header),
          isNull(apiKey.archived_at)
        )
      })
    )

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }

    await database().then(d => d.update(apiKeys)
      .set({ last_used_at: new Date() })
      .where(eq(apiKeys.id, apiKey.id))
    )
  }

  // Authenticate with Discord signatures
  if (pathname.startsWith('/api/discord')) {
    try {
      const signature = req.headers.get('x-signature-ed25519')
      const timestamp = req.headers.get('x-signature-timestamp')
      const isValidRequest = verifyKey(
        await req.clone().text(), signature, timestamp,
        process.env.DISCORD_BOT_PUBLIC_KEY
      )

      if (!isValidRequest) {
        throw new Error('Invalid signature')
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}
