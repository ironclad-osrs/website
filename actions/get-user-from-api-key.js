'use server'

import { database } from '@/services/database'

export const getUserFromApiKey = async (req) => {
  const header = req.headers.get('authorization') ?? ''

  const apiKey = await database.query.apiKeys.findFirst({
    where: (apiKey, { and, eq, isNull }) => and(
      eq(apiKey.key, header),
      isNull(apiKey.archived_at)
    ),
    with: {
      user: true
    }
  })

  return apiKey?.user
}
