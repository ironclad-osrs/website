import { serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const users = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    discord_user_id: text('discord_user_id').notNull(),
    discord_guild_id: text('discord_guild_id').notNull(),
    discord_nickname: text('discord_nickname').notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_discord_user_id_guild_id: unique().on(t.discord_user_id, t.discord_guild_id)
  })
)
