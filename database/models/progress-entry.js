import { integer, serial, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { pgTable } from '../helpers'

import { goals } from './goal'
import { accounts } from './account'

export const progressEntries = pgTable('progress_entry', {
  id: serial('id').primaryKey(),
  account_id: serial('account_id').notNull(),
  goal_id: serial('goal_id').notNull(),
  entry: integer('entry').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }),
  archived_at: timestamp('archived_at', { mode: 'date' })
})

export const progressEntryRelations = relations(progressEntries, ({ one }) => ({
  goal: one(goals, {
    fields: [progressEntries.goal_id],
    references: [goals.id]
  }),
  account: one(accounts, {
    fields: [progressEntries.account_id],
    references: [accounts.id]
  })
}))
