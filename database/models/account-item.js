import { integer, serial, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const accountItems = pgTable(
  'account_item',
  {
    id: serial('id').primaryKey(),
    account_id: serial('account_id').notNull(),
    item_id: integer('item_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_account_id_item_id: unique().on(t.account_id, t.item_id)
  })
)
