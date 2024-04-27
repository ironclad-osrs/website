import { serial, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { pgTable } from '../helpers'

import { users } from './user'

export const apiKeys = pgTable('api_key', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').notNull(),
  key: text('key').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  last_used_at: timestamp('last_used_at', { mode: 'date' }),
  archived_at: timestamp('archived_at', { mode: 'date' })
})

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.user_id],
    references: [users.id]
  })
}))
