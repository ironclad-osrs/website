import { integer, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const items = pgTable(
  'item',
  {
    id: serial('id').primaryKey(),
    item_id: integer('item_id').notNull(),
    name: text('name').notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_item_id: unique().on(t.item_id)
  })
)
