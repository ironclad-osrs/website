import { NextResponse } from 'next/server'
import * as yup from 'yup'

import { database } from '@/services/database'
import { oldschoolAccounts } from '@/database/schema'

import { getUserFromApiKey } from '@/actions/get-user-from-api-key'

const schema = yup.object({
  account_hash: yup.number(),
  character_name: yup.string()
})

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const user = await getUserFromApiKey(request)

    await database.insert(oldschoolAccounts)
      .values({
        user_id: user.id,
        account_hash: validated.account_hash,
        character_name: validated.character_name
      })
      .onConflictDoUpdate({
        target: [
          oldschoolAccounts.user_id,
          oldschoolAccounts.account_hash
        ],
        set: {
          character_name: validated.character_name,
          updated_at: new Date()
        }
      })

    return new Response(null, { status: 204 })
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
