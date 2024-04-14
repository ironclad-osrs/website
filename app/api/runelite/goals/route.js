import { getGoals } from '@/actions/get-goals'

import { NextResponse } from 'next/server'

export const GET = async () => {
  const goals = await getGoals()

  return NextResponse.json({ goals })
}
