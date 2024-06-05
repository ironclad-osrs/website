import merge from 'merge-deep'

import {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach
} from 'vitest'

import {
  clearDatabase,
  createDatabase,
  getMessage,
  eachScenario
} from '@/utils/test'

import { createGoal } from './create-goal'
import { getApiKey } from './get-api-key'

import { handleCommands } from './handle'

const $factory = (name, overrides = {}) => merge(
  { data: { name } }, overrides
)

const ERROR_MESSAGE = 'This command has not yet been implemented.'

describe('discord:commands/handle', () => {
  beforeAll(async () => {
    await createDatabase()
  })

  describe('available commands', () => {
    const scenarios = [
      {
        scenario: createGoal[0],
        ctx: $factory(createGoal[0], {
          data: {
            options: [
              { name: 'target_skill', value: 'woodcutting' },
              { name: 'xp_goal', value: 200 }
            ]
          }
        })
      },
      {
        scenario: getApiKey[0],
        ctx: $factory(getApiKey[0], {
          member: {
            user: {
              id: 'user-id',
              username: 'user-name'
            }
          },
          guild: {
            id: 'guild-id'
          }
        })
      }
    ]

    eachScenario(scenarios, ({ ctx }) => {
      let res

      beforeEach(async () => {
        res = await handleCommands(ctx)

        return async () => {
          await clearDatabase()
        }
      })

      it('should not return error message', async () => {
        expect(await getMessage(res)).to.not.eql(ERROR_MESSAGE)
      })
    })
  })

  describe('invalid commands', () => {
    let res

    beforeEach(async () => {
      res = await handleCommands($factory('foobar'))
    })

    it('should return an error message', async () => {
      expect(await getMessage(res)).to.eql(ERROR_MESSAGE)
    })
  })
})
