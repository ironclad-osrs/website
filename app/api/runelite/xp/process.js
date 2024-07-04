import { eq, sql } from 'drizzle-orm'

import { database } from '@/services/database'
import { goals, progressEntries, skills } from '@/database/schema'

export const processXp = async (accountId, data) => {
  // Get skills for current user
  const [existing, updated] = await database().then(d => d.batch([
    d.query.skills.findFirst({
      where: (skill, { and, eq }) => and(
        eq(skill.account_id, accountId),
        eq(skill.skill, data.skill)
      )
    }),
    d.insert(skills)
      .values({
        account_id: accountId,
        skill: data.skill,
        xp: data.xp
      })
      .onConflictDoUpdate({
        target: [
          skills.account_id,
          skills.skill
        ],
        set: {
          xp: data.xp,
          updated_at: new Date()
        }
      })
      .returning()
  ]))

  if (existing) {
    const diff = Math.max(0, updated[0].xp - existing.xp)

    if (diff === 0) {
      return new Response(null, { status: 202 })
    }

    // Find goal
    let goal = await database().then(d => d.query.goals
      .findFirst({
        where: (goal, { and, eq, isNull }) => and(
          eq(goal.skill, data.skill),
          isNull(goal.archived_at),
          isNull(goal.completed_at)
        )
      })
    )

    if (!goal) {
      return new Response(null, { status: 202 })
    }

    const overflow = Math.min(goal.goal - goal.progress, diff)

    // Create progress entry and update goal
    const [, updatedGoals] = await database().then(d => d.batch([
      d.insert(progressEntries)
        .values({
          account_id: accountId,
          goal_id: goal.id,
          entry: overflow
        }),
      d.update(goals)
        .set({
          progress: sql`${goals.progress} + ${overflow}`,
          updated_at: new Date()
        })
        .where(eq(goals.id, goal.id))
        .returning()
    ]))

    goal = updatedGoals[0]

    // Flag as complete
    if (goal.progress >= goal.goal) {
      await database().then(d => d.update(goals)
        .set({ completed_at: new Date() })
        .where(eq(goals.id, goal.id))
      )
    }
  }
}
