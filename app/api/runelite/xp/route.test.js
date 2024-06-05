import { testApiHandler } from 'next-test-api-route-handler'

import {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach
} from 'vitest'

import { database } from '@/services/database'
import { accounts, goals, skills } from '@/database/schema'

import {
  clearDatabase,
  createDatabase,
  createUserAndApiKey
} from '@/utils/test'

import * as handle from './route'

const $createAccount = async userId => (
  database().then(d => d.insert(accounts)
    .values({
      user_id: userId,
      account_hash: 200,
      character_name: 'character_name'
    })
    .returning()
  ).then(r => r[0])
)

const $findSkill = async skill => (
  database().then(d => d.query.skills
    .findFirst({
      where: ($skill, { eq }) => eq(
        $skill.skill, skill
      )
    })
  )
)

const $createSkill = async (accountId, skill = 'woodcutting', xp = 200) => (
  database().then(d => d.insert(skills)
    .values({
      account_id: accountId,
      skill,
      xp
    })
    .returning()
  ).then(r => r[0])
)

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

describe('runelite:xp', () => {
  let apiKey

  beforeAll(async () => {
    await createDatabase()
  })

  beforeEach(async () => {
    ({ apiKey } = await createUserAndApiKey())

    return async () => {
      await clearDatabase()
    }
  })

  describe('with invalid payload', () => {
    describe('with no account hash', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                skill: 'woodcutting',
                xp: 200
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with invalid account hash', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 200
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with no skill', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                xp: 200
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with invalid skill', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'foobar',
                xp: 200
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with invalid xp', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting'
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })
  })

  describe('with valid payload', () => {
    describe('with valid account hash', () => {
      beforeEach(async () => {
        await $createAccount(apiKey.user_id)
      })

      it('should respond with a success code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 200
              })
            })

            expect(res.status).to.equal(202)
          }
        })
      })
    })
  })

  describe('with new skill', () => {
    describe('with no goal', () => {
      let account

      beforeEach(async () => {
        account = await $createAccount(apiKey.user_id)
      })

      it('should create the skill for the current account', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 200
              })
            })

            const skill = await $findSkill('woodcutting')

            expect(skill).to.containSubset({
              account_id: account.id,
              skill: 'woodcutting',
              xp: 200
            })
          }
        })
      })
    })

    describe('with non-complete goal', () => {
      beforeEach(async () => {
        await $createAccount(apiKey.user_id)
        await $createGoal('woodcutting')
      })

      it('should not update the skill goal', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 1
              })
            })

            const goal = await $findGoal()

            expect(goal.progress).to.eql(0)
            expect(goal.updated_at).toBeNull()
          }
        })
      })
    })
  })

  describe('with existing skill', () => {
    describe('with no goal', () => {
      let account

      beforeEach(async () => {
        account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 100)
      })

      it('should update the skill for the current account', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 200
              })
            })

            const skill = await $findSkill('woodcutting')

            expect(skill.xp).to.eql(200)
            expect(skill.updated_at).not.toBeNull()
          }
        })
      })
    })

    describe('with no progress, and non-complete goal', () => {
      beforeEach(async () => {
        const account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 1)
        await $createGoal('woodcutting')
      })

      it('should not update the skill goal', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 1
              })
            })

            const goal = await $findGoal()

            expect(goal.progress).to.eql(0)
            expect(goal.updated_at).toBeNull()
          }
        })
      })
    })

    describe('with progress, and archived goal', () => {
      beforeEach(async () => {
        const account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 1)
        await $createGoal('woodcutting', new Date())
      })

      it('should not update the goal', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 2
              })
            })

            const goal = await $findGoal(true)

            expect(goal.progress).to.eql(0)
            expect(goal.updated_at).toBeNull()
          }
        })
      })
    })

    describe('with progress, and completed goal', () => {
      beforeEach(async () => {
        const account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 1)
        await $createGoal('woodcutting', undefined, new Date())
      })

      it('should not update the goal', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 2
              })
            })

            const goal = await $findGoal(undefined, true)

            expect(goal.progress).to.eql(0)
            expect(goal.updated_at).toBeNull()
          }
        })
      })
    })

    describe('with progress, and non-complete goal', () => {
      beforeEach(async () => {
        const account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 1)
        await $createGoal('woodcutting')
      })

      it('should update the skill goal based on the diff', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 2
              })
            })

            const goal = await $findGoal()

            expect(goal.progress).to.eql(1)
            expect(goal.updated_at).not.toBeNull()
          }
        })
      })
    })

    describe('with completing progress, and non-complete goal', () => {
      beforeEach(async () => {
        const account = await $createAccount(apiKey.user_id)

        await $createSkill(account.id, 'woodcutting', 1)
        await $createGoal('woodcutting')
      })

      it('should complete the goal', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                skill: 'woodcutting',
                xp: 201
              })
            })

            const goal = await $findGoal(undefined, true)

            expect(goal.progress).to.eql(200)
            expect(goal.completed_at).not.toBeNull()
            expect(goal.updated_at).not.toBeNull()
          }
        })
      })
    })
  })
})
