export const getMessage = async res => {
  const { data } = await res.json()

  return data?.content
}
