import { testApiHandler } from 'next-test-api-route-handler'

import {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach
} from 'vitest'

import { database } from '@/services/database'
import { accounts } from '@/database/schema'

import {
  clearDatabase,
  createDatabase,
  createUserAndApiKey
} from '@/utils/test'

import * as handle from './route'

const $findAccount = async userId => (
  database().then(d => d.query.accounts
    .findFirst({
      where: (account, { eq }) => eq(account.user_id, userId)
    })
  )
)

const $createAccount = async userId => (
  database()
    .then(d => d.insert(accounts)
      .values({
        user_id: userId,
        account_hash: 200,
        character_name: 'old_name'
      })
      .returning()
    )
    .then(r => r[0])
)

describe('runelite:characters', () => {
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
    describe('with no payload keys', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: '{}'
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with no account hash', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                character_name: 'foobar'
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
                account_hash: 'foobar',
                character_name: 'foobar'
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with no character name', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })

    describe('with invalid (complex-non-string) character name', () => {
      it('should respond with an error code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                character_name: {}
              })
            })

            expect(res.status).to.equal(400)
          }
        })
      })
    })
  })

  describe('with valid payload', () => {
    describe('with valid (positive) account hash', () => {
      it('should respond with a success code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                character_name: 'foobar'
              })
            })

            expect(res.status).to.equal(204)
          }
        })
      })
    })

    describe('with valid (negative) account hash', () => {
      it('should respond with a success code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: -200,
                character_name: 'foobar'
              })
            })

            expect(res.status).to.equal(204)
          }
        })
      })
    })

    describe('with valid (basic-non-string) character name', () => {
      it('should respond with a success code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                character_name: 100
              })
            })

            expect(res.status).to.equal(204)
          }
        })
      })
    })

    describe('with valid (string) character name', () => {
      it('should respond with a success code', async () => {
        await testApiHandler({
          appHandler: handle,
          test: async ({ fetch }) => {
            const res = await fetch({
              method: 'PUT',
              headers: { authorization: apiKey.key },
              body: JSON.stringify({
                account_hash: 200,
                character_name: 'foobar'
              })
            })

            expect(res.status).to.equal(204)
          }
        })
      })
    })
  })

  describe('with no existing account', () => {
    it('should create an account', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          await fetch({
            method: 'PUT',
            headers: { authorization: apiKey.key },
            body: JSON.stringify({
              account_hash: 200,
              character_name: 'foobar'
            })
          })

          const account = await $findAccount(apiKey.user_id)

          expect(account).to.containSubset({
            account_hash: '200',
            character_name: 'foobar'
          })
        }
      })
    })
  })

  describe('with an existing account', () => {
    let account

    beforeEach(async () => {
      account = await $createAccount(apiKey.user_id)
    })

    it('should update the account', async () => {
      await testApiHandler({
        appHandler: handle,
        test: async ({ fetch }) => {
          await fetch({
            method: 'PUT',
            headers: { authorization: apiKey.key },
            body: JSON.stringify({
              account_hash: 200,
              character_name: 'foobar'
            })
          })

          const nextAccount = await $findAccount(apiKey.user_id)

          expect(nextAccount).to.containSubset({
            id: account.id,
            account_hash: '200',
            character_name: 'foobar'
          })

          expect(nextAccount.updated_at).not.toBeNull()
        }
      })
    })
  })
})
