import { eq } from 'drizzle-orm'

import { database } from '@/services/database'
import { goals } from '@/database/schema'

import { sendChannelMessage, updateChannelMessage } from '../_helpers'
import { format } from '@/utils/number'

const getCurrentGoals = async () => (
  database.query.goals.findMany({
    where: (goal, { and, isNull }) => and(
      // isNull(goal.completed_at),
      isNull(goal.archived_at)
    ),
    with: {
      entries: {
        columns: {
          entry: true,
          account_id: true
        }
      }
    }
  })
)

const getAccountsForGoalEntries = async goals => {
  const accountIds = Array.from(
    goals.reduce((acc, goal) => (
      new Set([...acc, ...new Set(goal.entries.map(entry => entry.account_id))])
    ), [])
  )

  if (!accountIds.length) {
    return []
  }

  // Get accounts for those account IDs
  const accounts = await database.query.accounts.findMany({
    where: (account, { inArray }) => inArray(account.id, accountIds),
    columns: {
      id: true,
      character_name: true
    }
  })

  return accounts
}

const mergeGoalsAndAccounts = (goals, accounts) => (
  goals.map(goal => {
    // Group entries by account ID
    const entries = Object.entries(
      goal.entries.reduce((acc, entry) => {
        if (!acc[entry.account_id]) {
          acc[entry.account_id] = 0
        }

        acc[entry.account_id] += entry.entry

        return acc
      }, {})
    )

    return {
      ...goal,
      // Get character name for grouped entries
      entries: entries.reduce((acc, [accountId, contribution]) => {
        const account = accounts.find(account => account.id === Number(accountId))

        return [...acc, { name: account?.character_name, contribution }]
      }, [])
    }
  })
)

export const POST = async () => {
  const currentGoals = await getCurrentGoals()
  const accounts = await getAccountsForGoalEntries(currentGoals)
  const mapped = mergeGoalsAndAccounts(currentGoals, accounts)

  const makeStats = goal => [
    `Contributions for ${goal.skill} (${format(goal.progress)}/${format(goal.goal)} xp)\n`,
    goal.entries.length
      ? goal.entries.map(entry => `* ${entry.name}: ${entry.contribution} xp`).join('\n')
      : '_No contributions yet_',
    goal.completed_at
      ? '\n\n_Goal completed!_'
      : ''
  ].join('')

  const messagesToCreate = mapped.filter(goal => !goal.message_id)
  const messagesToUpdate = mapped.filter(goal => goal.message_id)

  const newMessages = await Promise.all([
    ...messagesToCreate.map(goal => (
      sendChannelMessage(makeStats(goal))
    )),
    ...messagesToUpdate.map(goal => updateChannelMessage(
      goal.message_id, makeStats(goal)
    ))
  ])

  await database.batch(messagesToCreate.map((goal, index) => {
    const msg = newMessages[index]

    return database.update(goals)
      .set({ message_id: msg.id, channel_id: msg.channel_id })
      .where(eq(goals.id, goal.id))
  }))

  return new Response(JSON.stringify(mapped), { status: 202 })
}