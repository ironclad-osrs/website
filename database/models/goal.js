import { index, integer, serial, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

import { pgTable } from '../helpers'

import { skillEnum } from './skill'
import { progressEntries } from './progress-entry'

export const goals = pgTable(
  'goal',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').default(sql`gen_random_uuid()`),
    channel_id: text('channel_id'),
    message_id: text('message_id'),
    skill: skillEnum('skill').notNull(),
    progress: integer('progress').default(0),
    goal: integer('goal').notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }),
    completed_at: timestamp('completed_at', { mode: 'date' }),
    archived_at: timestamp('archived_at', { mode: 'date' })
  },
  t => ({
    idx_uuid: index('idx_uuid').on(t.uuid),
    idx_skill: index('idx_skill').on(t.skill),
    idx_completed_at_archived_at: index('idx_completed_at_archived_at').on(
      t.completed_at, t.archived_at
    ),
    idx_channel_id_message_id: unique('idx_channel_id_message_id').on(
      t.channel_id, t.message_id
    )
  })
)

export const goalRelations = relations(goals, ({ many }) => ({
  entries: many(progressEntries)
}))
