import { NextResponse } from 'next/server'

import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions'

export const sendPrivateChannelMessage = message => (
  NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
      flags: InteractionResponseFlags.EPHEMERAL
    }
  })
)

export const getDisplayNameFromInteraction = interaction => (
  interaction.member.nick ?? interaction.member.user.username
)

export const getUserIdFromInteraction = interaction => (
  interaction.member.user.id
)

export const getGuildIdFromInteraction = interaction => (
  interaction.guild.id
)

export const getChannelIdFromInteraction = interaction => (
  interaction.channel_id
)

export const getInteractionOptions = interaction => {
  if (!interaction.data.options) {
    return {}
  }

  return (
    interaction.data.options.reduce((acc, opt) => (
      { ...acc, [opt.name]: opt.value }
    ), {})
  )
}
