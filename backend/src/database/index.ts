import 'reflect-metadata'
import { createConnection } from 'typeorm'

export const connectDB = async () => {
  return createConnection()
}
