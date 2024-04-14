import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { database } from '@/services/database'
import { pgTable } from '@/database/helpers'

const serverId = process.env.DISCORD_SERVER_ID
const guestRoleId = process.env.DISCORD_GUEST_ROLE_ID

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(database, pgTable),
  providers: [
    Discord({
      authorization:
        'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds+guilds.members.read'
    })
  ],
  callbacks: {
    signIn: async ({ account }) => {
      const { access_token: token } = account

      const res = await fetch(
        `https://discordapp.com/api/users/@me/guilds/${serverId}/member`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await res.json()

      return data && !data?.roles.every(role => role === guestRoleId)
    }
  },
  pages: {
    signIn: '/',
    error: '/'
  }
})
