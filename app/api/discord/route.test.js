import { InteractionType, InteractionResponseType } from 'discord-interactions'
import { testApiHandler } from 'next-test-api-route-handler'

import {
  afterEach,
  describe,
  expect,
  it,
  beforeAll
} from 'vitest'

import {
  clearDatabase,
  createDatabase,
  eachScenario
} from '@/utils/test'

import * as handle from './route'

describe('api/discord', () => {
  beforeAll(async () => {
    await createDatabase()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  const scenarios = [
    {
      scenario: 'when not a slash command',
      ctx: { type: InteractionType.PING },
      expected: { type: InteractionResponseType.PONG }
    },
    {
      scenario: 'when an available slash command',
      ctx: {
        data: {
          name: 'create-goal',
          options: []
        },
        type: InteractionType.APPLICATION_COMMAND
      },
      expected: {
        data: {
          content: 'Please make sure to provide both `target_skill` and `xp_goal` options'
        }
      }
    },
    {
      scenario: 'when an available slash command',
      ctx: {
        data: {
          name: 'foobar',
          options: []
        },
        type: InteractionType.APPLICATION_COMMAND
      },
      expected: {
        data: {
          content: 'This command has not yet been implemented.'
        }
      }
    }
  ]

  eachScenario(scenarios, ({ ctx, expected }) => {
    it('should respond with the expected response', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            body: JSON.stringify(ctx)
          })

          expect(await res.json()).to.containSubset(expected)
        }
      })
    })
  })
})
