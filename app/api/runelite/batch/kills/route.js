import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import * as yup from 'yup'

import { getAcccount } from '@/actions/get-account'
import { database } from '@/services/database'
import { accountKills, npcs } from '@/database/schema'

const schema = yup.object({
  account_hash: yup.number(),
  batch: yup.array().of(yup.object({
    npc_id: yup.string(),
    name: yup.string()
  }))
})

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const account = await getAcccount(request, validated.account_hash)

    await database().then(d => d.batch([
      // Update or create account kill entries
      ...validated.batch.map(kill => d.insert(accountKills)
        .values({
          account_id: account.id,
          npc_id: kill.npc_id
        })
        .onConflictDoUpdate({
          target: [
            accountKills.account_id,
            accountKills.npc_id
          ],
          set: {
            quantity: sql`${accountKills.quantity} + 1`,
            updated_at: new Date()
          }
        })
      ),
      // Create NPC entries
      ...validated.batch.map(kill => d.insert(npcs)
        .values({
          npc_id: kill.npc_id,
          name: kill.name
        })
        .onConflictDoNothing({
          target: npcs.npc_id
        })
      )
    ]))

    return new Response(null, { status: 202 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
