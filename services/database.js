import * as schema from '@/database/schema'
import { DEVELOPMENT, TEST } from '@/utils/environment'

let client

export const database = async () => {
  const connectionString = process.env.DATABASE_URL

  if (client) {
    return client
  }

  if (TEST) {
    const p = await import('pg')
    const d = await import('drizzle-orm/node-postgres')

    const sql = new p.Client({
      connectionString
    })

    await sql.connect()

    client = d.drizzle(sql, { schema })

    // Note:
    // Patch fake batch function for
    // during integration tests.
    client.batch = async queries => await Promise.all(queries)

    return client
  }

  const n = await import('@neondatabase/serverless')
  const d = await import('drizzle-orm/neon-http')

  const sql = n.neon(connectionString, {
    fetchOptions: {
      cache: 'no-cache'
    }
  })

  client = d.drizzle(sql, {
    logger: DEVELOPMENT,
    schema
  })

  return client
}
