import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '@/database/schema'
import { DEVELOPMENT } from '@/utils/environment'

const connectionString = process.env.DATABASE_URL

const sql = neon(connectionString)

export const database = drizzle(sql, {
  logger: DEVELOPMENT,
  schema
})
