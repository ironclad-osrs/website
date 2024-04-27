import { PRODUCTION } from '@/utils/environment'

export const serverId = PRODUCTION
  ? process.env.DISCORD_SERVER_ID
  : process.env.DISCORD_DEV_SERVER_ID

export const channelId = PRODUCTION
  ? process.env.DISCORD_CHANNEL_ID
  : process.env.DISCORD_DEV_CHANNEL_ID
