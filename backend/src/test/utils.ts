import { getConnection } from 'typeorm'

export async function resetDB() {
  const connection = getConnection()
  await connection.synchronize(true)
}
