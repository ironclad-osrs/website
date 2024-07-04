import { database } from '@/services/database'

import { getUserFromApiKey } from './get-user-from-api-key'

export const getAcccount = async (req, accountHash) => {
  const user = await getUserFromApiKey(req)

  // Check that account is owned by current API key
  const owned = await database().then(d => d.query.accounts
    .findFirst({
      where: (account, { and, eq, isNull }) => and(
        eq(account.user_id, user.id),
        eq(account.account_hash, accountHash),
        isNull(account.archived_at)
      )
    })
  )

  if (!owned) {
    throw new Error('Account not found.')
  }

  return owned
}
