import {
  beforeEach,
  describe,
  expect,
  it,
  beforeAll
} from 'vitest'

import { database } from '@/services/database'
import { goals, skillEnum } from '@/database/schema'

import {
  clearDatabase,
  createDatabase,
  getMessage
} from '@/utils/test'

import { createGoal } from './create-goal'

const [, handle] = createGoal

const $factory = (targetSkill, xpGoal) => ({
  data: {
    options: [
      targetSkill && { name: 'target_skill', value: targetSkill },
      xpGoal && { name: 'xp_goal', value: xpGoal }
    ].filter(Boolean)
  }
})

const $createGoal = async (skill, archivedAt, completedAt) => (
  database().then(d => d.insert(goals)
    .values({
      skill,
      goal: 200,
      archived_at: archivedAt,
      completed_at: completedAt
    })
    .returning()
  ).then(r => r[0])
)

const $findGoal = async (archivedAt, completedAt) => (
  database().then(d => d.query.goals
    .findFirst({
      where: (goals, { and, isNull, isNotNull }) => and(
        archivedAt
          ? isNotNull(goals.archived_at)
          : isNull(goals.archived_at),
        completedAt
          ? isNotNull(goals.completed_at)
          : isNull(goals.completed_at)
      )
    })
  )
)

describe('discord:commands/create-goal', () => {
  beforeAll(async () => {
    await createDatabase()
  })

  describe('without providing a target skill and xp goal', () => {
    let res

    beforeEach(async () => {
      res = await handle($factory())
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.eql(
        'Please make sure to provide both `target_skill` and `xp_goal` options'
      )
    })
  })

  describe('without providing a target skill', () => {
    let res

    beforeEach(async () => {
      res = await handle($factory(undefined, 200))
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.eql(
        'Please make sure to provide both `target_skill` and `xp_goal` options'
      )
    })
  })

  describe('without providing a xp goal', () => {
    let res

    beforeEach(async () => {
      res = await handle($factory('woodcutting'))
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.eql(
        'Please make sure to provide both `target_skill` and `xp_goal` options'
      )
    })
  })

  describe('providing an invalid target skill', () => {
    let res

    beforeEach(async () => {
      res = await handle($factory('foobar', 200))
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.match(
        /^Please make sure to provide a valid skill\. Available skills are/
      )
    })

    it('should list available skills', async () => {
      const validSkills = skillEnum.enumValues

      expect(await getMessage(res)).to.match(
        new RegExp(`${validSkills.join(', ')}$`)
      )
    })
  })

  describe('providing a valid target skill', () => {
    let res
    let goal

    beforeEach(async () => {
      res = await handle($factory('woodcutting', 200))
      goal = await $findGoal()

      return async () => {
        await clearDatabase()
      }
    })

    it('should return a success message', async () => {
      expect(await getMessage(res)).to.eql(
        `A goal has been created for woodcutting with the target of 200 xp:\n${goal.uuid}`
      )
    })
  })

  describe('attempt to create a second goal for an on-going skill goal', () => {
    let res
    let goal

    beforeEach(async () => {
      goal = await $createGoal('woodcutting')
      res = await handle($factory('woodcutting', 200))

      return async () => {
        await clearDatabase()
      }
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.eql(
        `There is currently an on-going goal for this skill. Please archive or complete before creating another:\n${goal.uuid}`
      )
    })
  })

  describe('attempt to create a second goal for a completed skill goal', () => {
    let res
    let goal

    beforeEach(async () => {
      await $createGoal('woodcutting', undefined, new Date())

      res = await handle($factory('woodcutting', 200))

      goal = await $findGoal()

      return async () => {
        await clearDatabase()
      }
    })

    it('should return a success message', async () => {
      expect(await getMessage(res)).to.eql(
        `A goal has been created for woodcutting with the target of 200 xp:\n${goal.uuid}`
      )
    })
  })

  describe('attempt to create a second goal for a archived skill goal', () => {
    let res
    let goal

    beforeEach(async () => {
      await $createGoal('woodcutting', new Date())

      res = await handle($factory('woodcutting', 200))

      goal = await $findGoal()

      return async () => {
        await clearDatabase()
      }
    })

    it('should return a success message', async () => {
      expect(await getMessage(res)).to.eql(
        `A goal has been created for woodcutting with the target of 200 xp:\n${goal.uuid}`
      )
    })
  })
})
