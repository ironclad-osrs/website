import { uid } from 'uid/secure'
import { eq } from 'drizzle-orm'

import { database } from '@/services/database'
import { apiKeys, users } from '@/database/schema'
import { returnFirst } from '@/utils/return-first'

import {
  getDisplayNameFromInteraction,
  getGuildIdFromInteraction,
  getUserIdFromInteraction,
  sendPrivateChannelMessage
} from './_helpers'

const name = 'get-api-key'

const handle = async interaction => {
  const name = getDisplayNameFromInteraction(interaction)
  const userId = getUserIdFromInteraction(interaction)
  const guildId = getGuildIdFromInteraction(interaction)

  let user = await database.query.users
    .findFirst({
      where: (user, { and, eq }) => and(
        eq(user.discord_user_id, userId),
        eq(user.discord_guild_id, guildId)
      )
    })

  if (!user) {
    user = await returnFirst(
      database.insert(users)
        .values({
          discord_user_id: userId,
          discord_guild_id: guildId,
          discord_nickname: name
        })
    )
  }

  let apiKey = await database.query.apiKeys
    .findFirst({
      where: (apiKey, { and, eq, isNull }) => and(
        eq(apiKey.user_id, user.id),
        isNull(apiKey.archived_at)
      )
    })

  if (!apiKey) {
    apiKey = await returnFirst(
      database.insert(apiKeys)
        .values({
          user_id: user.id,
          key: uid(20)
        })
    )
  }

  await database.update(apiKeys)
    .set({ last_used_at: new Date() })
    .where(eq(apiKeys.id, apiKey.id))

  return sendPrivateChannelMessage(`Hey ${name}, your API key is:\n${apiKey.key}`)
}

export const getApiKey = [name, handle]
