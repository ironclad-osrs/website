'use server'

import { database } from '@/services/database'

export const getGoals = async () => {
  const goals = await database.query.goals.findMany({
    where: (goal, { and, isNull }) => and(
      isNull(goal.archived_at),
      isNull(goal.completed_at)
    ),
    columns: {
      id: false
    }
  })

  return goals
}
