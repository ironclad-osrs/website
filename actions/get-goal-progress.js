'use server'

import { endOfDay, startOfDay, subWeeks } from 'date-fns'
import { and, eq, gte, lte, sql } from 'drizzle-orm'

import { database } from '@/services/database'
import { progressEntries } from '@/database/schema'

export const getGoalProgress = async (goalId) => {
  const lastWeek = subWeeks(startOfDay(new Date()), 1)
  const endOfToday = endOfDay(new Date())

  const entries = database.select()
    .from(progressEntries)
    .where(and(
      eq(progressEntries.goal_id, goalId),
      gte(progressEntries.created_at, lastWeek),
      lte(progressEntries.created_at, endOfToday)
    ))
    .groupBy(and(
      progressEntries.oldschool_account_id,
      sql`date_trunc('day', ${progressEntries.created_at})`
    ))

  return entries
}
