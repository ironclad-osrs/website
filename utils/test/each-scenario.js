import { describe } from 'vitest'

export const eachScenario = (scenarios, fn) => {
  for (let i = 0; i < scenarios.length; i++) {
    const current = scenarios[i]

    describe(current.scenario, () => fn(current))
  }
}
