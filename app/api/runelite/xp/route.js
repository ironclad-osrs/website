import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import * as yup from 'yup'

import { getUserFromApiKey } from '@/actions/get-user-from-api-key'
import { skills as skillEnum } from '@/utils/skill'

import { database } from '@/services/database'
import { goals, progressEntries, skills } from '@/database/schema'

const schema = yup.object({
  account_hash: yup.number(),
  skill: yup.string().oneOf(skillEnum),
  xp: yup.number()
})

export const dynamic = 'force-dynamic'

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const user = await getUserFromApiKey(request)

    // Check that account is owned by current API key
    const owned = await database().then(d => d.query.accounts
      .findFirst({
        where: (account, { and, eq, isNull }) => and(
          eq(account.user_id, user.id),
          isNull(account.archived_at)
        )
      })
    )

    if (!owned) {
      throw new Error('Account not found.')
    }

    // Get skills for current user
    const [existing, updated] = await database().then(d => d.batch([
      d.query.skills.findFirst({
        where: (skill, { and, eq }) => and(
          eq(skill.account_id, owned.id),
          eq(skill.skill, validated.skill)
        )
      }),
      d.insert(skills)
        .values({
          account_id: owned.id,
          skill: validated.skill,
          xp: validated.xp
        })
        .onConflictDoUpdate({
          target: [
            skills.account_id,
            skills.skill
          ],
          set: {
            xp: validated.xp,
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
            eq(goal.skill, validated.skill),
            isNull(goal.archived_at),
            isNull(goal.completed_at)
          )
        })
      )

      if (!goal) {
        return new Response(null, { status: 202 })
      }

      // Create progress entry and update goal
      const [, updatedGoals] = await database().then(d => d.batch([
        d.insert(progressEntries)
          .values({
            account_id: owned.id,
            goal_id: goal.id,
            entry: diff
          }),
        d.update(goals)
          .set({
            progress: sql`${goals.progress} + ${diff}`,
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

    return new Response(null, { status: 202 })
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
