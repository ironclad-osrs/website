import { describe, expect, it } from 'vitest'

import { commandOptions } from './_test-utils'

import { getApiKey } from './get-api-key'

describe('register:commands/get-api-key', () => {
  it('should have the expected name', () => {
    expect(getApiKey.name).to.eql('get-api-key')
  })

  it('should have the expected description', () => {
    expect(getApiKey.description).to.eql(
      'Get your API key to contribute to clan goals'
    )
  })

  it('should have no options', () => {
    expect(commandOptions(getApiKey)).to.eql([])
  })
})
