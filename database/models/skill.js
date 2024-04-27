import { integer, pgEnum, serial, timestamp, unique } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

export const skillEnum = pgEnum('skill', [
  'attack',
  'strength',
  'defence',
  'ranged',
  'prayer',
  'magic',
  'runecraft',
  'hitpoints',
  'crafting',
  'mining',
  'smithing',
  'fishing',
  'cooking',
  'firemaking',
  'woodcutting',
  //
  'agility',
  'herblore',
  'thieving',
  'fletching',
  'slayer',
  'farming',
  'construction',
  'hunter'
])

export const skills = pgTable(
  'skill',
  {
    id: serial('id').primaryKey(),
    account_id: serial('account_id').notNull(),
    skill: skillEnum('skill').notNull(),
    xp: integer('xp').default(0),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' })
  },
  (t) => ({
    idx_account_id_skill: unique().on(t.account_id, t.skill)
  })
)
