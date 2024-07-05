import { integer, serial, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const accountKills = pgTable(
  'account_kills',
  {
    id: serial('id').primaryKey(),
    account_id: serial('account_id').notNull(),
    npc_id: integer('npc_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_account_id_npc_id: unique().on(t.account_id, t.npc_id)
  })
)
