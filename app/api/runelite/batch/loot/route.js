import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import * as yup from 'yup'

import { getAcccount } from '@/actions/get-account'
import { database } from '@/services/database'
import { accountItems, items } from '@/database/schema'

const schema = yup.object({
  account_hash: yup.number(),
  batch: yup.array().of(yup.object({
    item_id: yup.string(),
    quantity: yup.number(),
    name: yup.string()
  }))
})

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const account = await getAcccount(request, validated.account_hash)

    await database().then(d => d.batch([
      // Update or create account item entries
      ...validated.batch.map(item => d.insert(accountItems)
        .values({
          account_id: account.id,
          item_id: item.item_id,
          quantity: item.quantity
        })
        .onConflictDoUpdate({
          target: [
            accountItems.account_id,
            accountItems.item_id
          ],
          set: {
            quantity: sql`${accountItems.quantity} + ${item.quantity}`,
            updated_at: new Date()
          }
        })
      ),
      // Update or create item entries
      ...validated.batch.map(item => d.insert(items)
        .values({
          item_id: item.item_id,
          name: item.name
        })
        .onConflictDoNothing({
          target: items.item_id
        })
      )
    ]))

    return new Response(null, { status: 202 })
  } catch (err) {
    console.log(err.message)
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
