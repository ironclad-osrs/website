import { channelId } from './_constants'

export const sendChannelMessage = async message => {
  const uri = new URL(
    `channels/${channelId}/messages`,
    process.env.DISCORD_API_URI
  )

  const res = await fetch(uri, {
    method: 'POST',
    headers: {
      authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      content: message
    })
  })

  return res.json()
}

export const updateChannelMessage = async (messageId, message) => {
  const uri = new URL(
      `channels/${channelId}/messages/${messageId}`,
      process.env.DISCORD_API_URI
  )

  const res = await fetch(uri, {
    method: 'PATCH',
    headers: {
      authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      content: message
    })
  })

  return res.json()
}
