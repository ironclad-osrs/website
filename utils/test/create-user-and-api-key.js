import { uid } from 'uid'

import { database } from '@/services/database'
import { apiKeys } from '@/database/schema'

import { createUser } from './create-user'

const $createApiKey = async (userId, archivedAt) => (
  database().then(d => (
    d.insert(apiKeys)
      .values({
        user_id: userId,
        key: uid(20),
        archived_at: archivedAt ?? null
      })
      .returning()
  )).then(r => r[0])
)

export const createUserAndApiKey = async archivedAt => {
  const user = await createUser()
  const apiKey = await $createApiKey(user.id, archivedAt)

  return {
    user,
    apiKey
  }
}
