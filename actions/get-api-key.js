'use server'

import { uid } from 'uid/secure'

import { database } from '@/services/database'

import { getUser } from './get-user'
import { apiKeys } from '@/database/schema'

export const getApiKey = async () => {
  const user = await getUser()

  if (!user) return

  const existing = await database.query.apiKeys.findFirst({
    where: (apiKey, { and, eq, isNull }) => and(
      eq(apiKey.user_id, user.id),
      isNull(apiKey.archived_at)
    )
  })

  if (existing) {
    return existing.key
  }

  const apiKey = uid()

  await database.insert(apiKeys).values({
    user_id: user.id,
    key: apiKey
  })

  return apiKey
}
