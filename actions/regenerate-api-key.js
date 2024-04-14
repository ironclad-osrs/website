'use server'

import { uid } from 'uid/secure'
import { and, eq, isNotNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { database } from '@/services/database'

import { getUser } from './get-user'
import { apiKeys } from '@/database/schema'

export const regenerateApiKey = async () => {
  const user = await getUser()

  if (!user) return

  await database.batch([
    database.update(apiKeys)
      .set({ archived_at: new Date() })
      .where(and(
        eq(apiKeys.user_id, user.id),
        isNotNull(apiKeys.archived_at)
      )),
    database.insert(apiKeys).values({
      user_id: user.id,
      key: uid()
    })
  ])

  revalidatePath('/dashboard/settings')
}
