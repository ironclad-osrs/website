'use server'

import { database } from '@/services/database'

export const getUserFromApiKey = async (req) => {
  const header = req.headers.get('authorization') ?? ''

  const apiKey = await database().then(d => d.query.apiKeys
    .findFirst({
      where: (apiKey, { and, eq, isNull }) => and(
        eq(apiKey.key, header),
        isNull(apiKey.archived_at)
      ),
      with: {
        user: true
      }
    })
  )

  if (!apiKey?.user) {
    throw new Error('User not found.')
  }

  return apiKey?.user
}
