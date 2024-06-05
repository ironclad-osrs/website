import { describe, expect, it } from 'vitest'

import * as commands from './index'

describe('register:index', () => {
  it('should export the create goal command', () => {
    expect(commands.createGoal).not.toBeUndefined()
  })

  it('should export the get api key command', () => {
    expect(commands.getApiKey).not.toBeUndefined()
  })
})
