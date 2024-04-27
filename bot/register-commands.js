import { REST, Routes } from 'discord.js'

import { PRODUCTION } from '@/utils/environment'

import * as commands from './commands'

// TODO: Move command creation into Next

const main = async () => {
  const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN)

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.AUTH_DISCORD_ID,
      PRODUCTION
        ? process.env.DISCORD_SERVER_ID
        : process.env.DISCORD_DEV_SERVER_ID
    ),
    { body: Object.values(commands).map(command => command.toJSON()) }
  )

  console.log('Commands successfully registered.')
}

main()
