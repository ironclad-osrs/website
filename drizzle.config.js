import { config as dotenv } from 'dotenv'

dotenv({ path: '.env.local' })

/** @type { import("drizzle-kit").Config } */
const config = {
  schema: './database/schema.js',
  out: './database/migrations',
  driver: 'pg',
  tablesFilter: ['ironclad_*'],
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
}

export default config
