import { NextResponse } from 'next/server'
import * as yup from 'yup'

import { getAcccount } from '@/actions/get-account'
import { skills as skillEnum } from '@/utils/skill'

import { processXp } from './process'

const schema = yup.object({
  account_hash: yup.number(),
  skill: yup.string().oneOf(skillEnum),
  xp: yup.number()
})

export const dynamic = 'force-dynamic'

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const account = await getAcccount(request, validated.account_hash)

    await processXp(account.id, validated)

    return new Response(null, { status: 202 })
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
