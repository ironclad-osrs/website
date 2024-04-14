'use server'

import { database } from '@/services/database'

import { getUser } from './get-user'

export const getCharacters = async () => {
  const user = await getUser()

  if (!user) return

  const characters = await database.query.oldschoolAccounts.findMany({
    where: (account, { and, eq, isNull }) => and(
      eq(account.user_id, user.id),
      isNull(account.archived_at)
    ),
    columns: {
      id: true,
      character_name: true,
      created_at: true,
      updated_at: true,
      archived_at: true
    }
  })

  return characters
}
