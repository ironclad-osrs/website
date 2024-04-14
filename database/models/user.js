import { text, timestamp } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image')
})
