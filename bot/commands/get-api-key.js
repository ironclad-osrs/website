import { SlashCommandBuilder } from 'discord.js'

export const getApiKey = new SlashCommandBuilder()
  .setName('get-api-key')
  .setDescription('Get your API key to contribute to clan goals')
