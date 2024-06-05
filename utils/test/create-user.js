import { database } from '@/services/database'
import { users } from '@/database/schema'

export const createUser = async () => (
  database().then(d => (
    d.insert(users)
      .values({
        discord_user_id: 'user-id',
        discord_guild_id: 'guild-id',
        discord_nickname: 'foobar'
      })
      .returning()
  )).then(r => r[0])
)
