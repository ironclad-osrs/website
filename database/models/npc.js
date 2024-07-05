import { integer, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const npcs = pgTable(
  'npc',
  {
    id: serial('id').primaryKey(),
    npc_id: integer('npc_id').notNull(),
    name: text('name').notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_npc_id: unique().on(t.npc_id)
  })
)
