export const commandOptions = command => (
  JSON.parse(JSON.stringify(command.options))
)

export const commandOption = overrides => ({
  ...overrides
})

export const stringCommandOption = overrides => commandOption({
  ...overrides,
  type: 3
})

export const numberCommandOption = overrides => commandOption({
  ...overrides,
  type: 10
})
