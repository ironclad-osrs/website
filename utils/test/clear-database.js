import pg from 'pg'

export const clearDatabase = async () => {
  try {
    const client = new pg.Client(process.env.DATABASE_URL)

    await client.connect()

    const sql = await client.query(
      'select \'delete from "\' || tablename || \'";\' as query from pg_tables where tablename like \'ironclad_%\''
    )

    await Promise.all(sql.rows.map(sql => client.query(sql.query)))
    await client.end()
  } catch { }
}
