import { NextResponse } from 'next/server'

import {
  InteractionType,
  InteractionResponseType
} from 'discord-interactions'

import { handleCommands } from './_commands/handle'

export const dynamic = 'force-dynamic'

export const POST = async req => {
  const interaction = await req.json()

  console.debug('interaction %O', interaction)

  if (interaction.type !== InteractionType.APPLICATION_COMMAND) {
    return NextResponse.json({
      type: InteractionResponseType.PONG
    })
  }

  return await handleCommands(interaction)
}
