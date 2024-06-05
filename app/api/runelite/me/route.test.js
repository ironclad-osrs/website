import { testApiHandler } from 'next-test-api-route-handler'
import pick from 'just-pick'

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
  createUserAndApiKey
} from '@/utils/test'

import * as handle from './route'

describe('runelite:me', () => {
  beforeAll(async () => {
    await createDatabase()
  })

  describe('without authentication', () => {
    it('should respond with an error code', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          const res = await fetch()

          expect(res.status).to.equal(403)
        }
      })
    })
  })

  describe('with invalid authentication', () => {
    it('should respond with an error code', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          const res = await fetch({
            headers: {
              authorization: 'foobar'
            }
          })

          expect(res.status).to.equal(403)
        }
      })
    })
  })

  describe('with authentication', () => {
    let user
    let apiKey

    beforeEach(async () => {
      ({ user, apiKey } = await createUserAndApiKey())

      return async () => {
        await clearDatabase()
      }
    })

    it('should respond with the current user', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          const res = await fetch({
            headers: {
              authorization: apiKey.key
            }
          })

          expect(await res.json()).to.eql({
            user: pick(user, ['name'])
          })
        }
      })
    })
  })
})
