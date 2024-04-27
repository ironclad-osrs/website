import { sendPrivateChannelMessage } from './_helpers'

import { createGoal } from './create-goal'
import { getApiKey } from './get-api-key'

const map = new Map([
  createGoal,
  getApiKey
])

export const handleCommands = async interaction => {
  const { name: command } = interaction.data
  const handle = map.get(command)

  if (!handle) {
    return sendPrivateChannelMessage('This command has not yet been implemented.')
  }

  return handle(interaction)
}
