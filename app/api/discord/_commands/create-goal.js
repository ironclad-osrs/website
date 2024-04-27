import { database } from '@/services/database'
import { goals, skillEnum } from '@/database/schema'

import { returnFirst } from '@/utils/return-first'
import { format } from '@/utils/number'

import {
  getInteractionOptions,
  sendPrivateChannelMessage
} from './_helpers'

const name = 'create-goal'

const handle = async interaction => {
  const options = getInteractionOptions(interaction)

  if (!options.target_skill || !options.xp_goal) {
    return sendPrivateChannelMessage(
      'Please make sure to provide both `target_skill` and `xp_goal` options'
    )
  }

  const validSkills = skillEnum.enumValues

  if (!validSkills.includes(options.target_skill)) {
    return sendPrivateChannelMessage(
      `Please make sure to provide a valid skill. Available skills are:\n${validSkills.join(', ')}`
    )
  }

  const existing = await database.query.goals.findFirst({
    where: (goal, { and, eq, isNull }) => and(
      eq(goal.skill, options.target_skill),
      isNull(goal.archived_at),
      isNull(goal.completed_at)
    )
  })

  if (existing) {
    return sendPrivateChannelMessage(
      `There is currently an on-going goal for this skill. Please archive or complete before creating another:\n${existing.uuid}`
    )
  }

  const goal = await returnFirst(
    database.insert(goals)
      .values({
        skill: options.target_skill,
        goal: options.xp_goal
      })
  )

  return sendPrivateChannelMessage(
    `A goal has been created for ${goal.skill} with the target of ${format(goal.goal)} xp:\n${goal.uuid}`
  )
}

export const createGoal = [name, handle]
