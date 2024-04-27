import { SlashCommandBuilder } from 'discord.js'

export const createGoal = new SlashCommandBuilder()
  .setName('create-goal')
  .setDescription('Create a clan goal')
  .addStringOption(option => (
    option.setName('target_skill').setDescription('The target skill to train')
  ))
  .addNumberOption(option => (
    option.setName('xp_goal').setDescription('The XP goal to work towards')
  ))
