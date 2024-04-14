import { integer, serial, text, timestamp } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const progressEntries = pgTable('progress_entry', {
  id: serial('id').primaryKey(),
  oldschool_account_id: text('oldschool_account_id').notNull(),
  goal_id: serial('goal_id').notNull(),
  entry: integer('entry').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }),
  archived_at: timestamp('archived_at', { mode: 'date' })
})
