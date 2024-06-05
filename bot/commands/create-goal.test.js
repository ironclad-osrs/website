import { describe, expect, it } from 'vitest'

import { commandOptions, numberCommandOption, stringCommandOption } from './_test-utils'

import { createGoal } from './create-goal'

describe('register:commands/create-goal', () => {
  it('should have the expected name', () => {
    expect(createGoal.name).to.eql('create-goal')
  })

  it('should have the expected description', () => {
    expect(createGoal.description).to.eql('Create a clan goal')
  })

  it('should have the expected options', () => {
    expect(commandOptions(createGoal)).to.eql([
      stringCommandOption({
        required: true,
        name: 'target_skill',
        description: 'The target skill to train'
      }),
      numberCommandOption({
        required: true,
        name: 'xp_goal',
        description: 'The XP goal to work towards'
      })
    ])
  })
})
