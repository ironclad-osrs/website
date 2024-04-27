export const returnFirst = async (query, fields) => (
  (await query.returning(fields))[0]
)
