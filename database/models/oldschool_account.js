import { serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const oldschoolAccounts = pgTable(
  'oldschool_account',
  {
    id: serial('id').primaryKey(),
    user_id: text('user_id').notNull(),
    account_hash: text('account_hash').notNull(),
    character_name: text('character_name').notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }),
    archived_at: timestamp('archived_at', { mode: 'date' })
  },
  (t) => ({
    idx_user_id_account_hash: unique().on(t.user_id, t.account_hash)
  })
)
