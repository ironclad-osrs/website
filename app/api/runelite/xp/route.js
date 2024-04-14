import * as yup from 'yup'

import { getUserFromApiKey } from '@/actions/get-user-from-api-key'

import { skills as skillEnum } from '@/utils/skill'
import { database } from '@/services/database'
import { NextResponse } from 'next/server'
import { goals, progressEntries, skills } from '@/database/schema'
import { sql } from 'drizzle-orm'

const schema = yup.object({
  account_hash: yup.string(),
  skill: yup.string().oneOf(skillEnum),
  xp: yup.number()
})

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const user = await getUserFromApiKey(request)

    const owned = await database.query.oldschoolAccounts.findFirst({
      where: (account, { and, eq, isNull }) => and(
        eq(account.user_id, user.id),
        isNull(account.archived_at)
      )
    })

    if (!owned) {
      throw new Error('Account not found.')
    }

    const [existing, updated] = await database.batch([
      database.query.skills.findFirst({
        where: (skill, { and, eq }) => and(
          eq(skill.oldschool_account_id, owned.id),
          eq(skill.skill, validated.skill)
        )
      }),
      database.insert(skills)
        .values({
          oldschool_account_id: owned.id,
          skill: validated.skill,
          xp: validated.xp
        })
        .onConflictDoUpdate({
          target: [
            skills.oldschool_account_id,
            skills.skill
          ],
          set: {
            xp: validated.xp,
            updated_at: new Date()
          }
        })
        .returning()
    ])

    if (existing) {
      const diff = Math.max(0, updated[0].xp - existing.xp)

      if (diff === 0) {
        return new Response(null, { status: 202 })
      }

      const goal = await database.query.goals.findFirst({
        where: (goal, { and, eq, isNull }) => and(
          eq(goal.skill, validated.skill),
          isNull(goal.archived_at),
          isNull(goal.completed_at)
        )
      })

      if (!goal) {
        return new Response(null, { status: 202 })
      }

      await database.batch([
        await database.insert(progressEntries)
          .values({
            oldschool_account_id: owned.id,
            goal_id: goal.id,
            entry: diff
          }),
        await database.update(goals)
          .set({
            progress: sql`${goals.progress} + ${diff}`,
            updated_at: new Date()
          })
      ])
    }

    return new Response(null, { status: 202 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
