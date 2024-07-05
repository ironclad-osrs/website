import { NextResponse } from 'next/server'
import * as yup from 'yup'

import { getAcccount } from '@/actions/get-account'
import { skills as skillEnum } from '@/utils/skill'

import { processXp } from '../../xp/process'

const schema = yup.object({
  account_hash: yup.number(),
  batch: yup.array().of(yup.object({
    skill: yup.string().oneOf(skillEnum),
    xp: yup.number()
  }))
})

export const PUT = async (request) => {
  try {
    const validated = await schema.validate(await request.json())
    const account = await getAcccount(request, validated.account_hash)

    for (let i = 0; i < validated.batch.length; i++) {
      await processXp(account.id, validated.batch[i])
    }

    return new Response(null, { status: 202 })
  } catch (err) {
    console.log(err.message)
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}
