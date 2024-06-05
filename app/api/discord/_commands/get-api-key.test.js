import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  beforeAll
} from 'vitest'

import { database } from '@/services/database'

import {
  clearDatabase,
  createDatabase,
  createUserAndApiKey
} from '@/utils/test'

import { getApiKey } from './get-api-key'

const [, handle] = getApiKey

const $factory = nickname => ({
  member: {
    nick: nickname ?? null,
    user: {
      id: 'user-id',
      username: 'user-name'
    }
  },
  guild: {
    id: 'guild-id'
  }
})

const $findUser = () => database().then(d => d.query.users
  .findFirst({
    where: (user, { and, eq }) => and(
      eq(user.discord_user_id, 'user-id'),
      eq(user.discord_guild_id, 'guild-id')
    )
  })
)

const $findApiKey = userId => (
  database().then(d => d.query.apiKeys
    .findFirst({
      where: (apiKey, { and, eq, isNull }) => and(
        eq(apiKey.user_id, userId),
        isNull(apiKey.archived_at)
      )
    })
  )
)

describe('discord:commands/get-api-key', () => {
  beforeAll(async () => {
    await createDatabase()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('new user', () => {
    describe('defaults', () => {
      const interaction = $factory()

      let user
      let apiKey

      beforeEach(async () => {
        await handle(interaction)

        user = await $findUser()
        apiKey = await $findApiKey(user.id)
      })

      it('should create a user with the expected discord user id', () => {
        expect(user.discord_user_id).to.eql('user-id')
      })

      it('should create a user with the expected discord nickname', () => {
        expect(user.discord_nickname).to.eql('user-name')
      })

      it('should create a user with the expected discord guild id', () => {
        expect(user.discord_guild_id).to.eql('guild-id')
      })

      it('should create an api key with an key', () => {
        expect(apiKey.key).toBeTypeOf('string')
        expect(apiKey.key).toHaveLength(20)
      })

      it('should update the last used at for api key', () => {
        expect(apiKey.last_used_at).toBeInstanceOf(Date)
      })
    })

    describe('with nickname', () => {
      const interaction = $factory('member-nick')
      let user

      beforeEach(async () => {
        await handle(interaction)

        user = await $findUser()
      })

      it('should create a new user with their nickname', () => {
        expect(user.discord_nickname).to.eql('member-nick')
      })
    })

    describe('without nickname', () => {
      const interaction = $factory()
      let user

      beforeEach(async () => {
        await handle(interaction)

        user = await $findUser()
      })

      it('should create a new user with their username', () => {
        expect(user.discord_nickname).to.eql('user-name')
      })
    })
  })

  describe('existing user', () => {
    describe('defaults', () => {
      const interaction = $factory()

      let user
      let apiKey

      let nextUser
      let nextApiKey

      beforeEach(async () => {
        ({ user, apiKey } = await createUserAndApiKey())

        await handle(interaction)

        nextUser = await $findUser()
        nextApiKey = await $findApiKey(nextUser.id)
      })

      it('should not create a new user', () => {
        expect(user.id).to.eql(nextUser.id)
      })

      it('should not create a new api key', () => {
        expect(apiKey.id).to.eql(nextApiKey.id)
      })

      it('should update api key last used at', () => {
        expect(apiKey.last_used_at).to.not.eql(
          nextApiKey.last_used_at
        )
      })
    })

    describe('with archived api key', () => {
      const interaction = $factory()

      let user
      let apiKey

      let nextApiKey

      beforeEach(async () => {
        ({ user, apiKey } = await createUserAndApiKey(new Date()))

        await handle(interaction)

        nextApiKey = await $findApiKey(user.id)
      })

      it('should create a new api key', () => {
        expect(apiKey.id).to.not.eql(nextApiKey.id)
        expect(apiKey.key).to.not.eql(nextApiKey.key)
      })
    })
  })
})
