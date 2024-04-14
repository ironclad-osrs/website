import { timestamp, text } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

import { users } from './user'

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
})
