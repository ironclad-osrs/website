import { integer, serial, timestamp } from 'drizzle-orm/pg-core'

import { pgTable } from '../helpers'

import { skillEnum } from './skill'

export const goals = pgTable('goal', {
  id: serial('id').primaryKey(),
  skill: skillEnum('skill').notNull(),
  progress: integer('progress').default(0),
  goal: integer('goal').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }),
  completed_at: timestamp('completed_at', { mode: 'date' }),
  archived_at: timestamp('archived_at', { mode: 'date' })
})
