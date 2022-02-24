import 'reflect-metadata'
import { createConnection } from 'typeorm'
import '../../config/env'

export const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    return createConnection({
      type: 'postgres',
      host: process.env.DB_URL || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      // password: 'postgres',
      database: process.env.DB_NAME || 'solana_hack_nft_test',
      entities: ['src/entity/**/!(*.test.ts)'],
      subscribers: ['src/subscriber/**/!(*.test.ts)'],
      migrations: ['migration/**/*.ts'],
      dropSchema: true,
      synchronize: true,
    })
  }

  return createConnection()
}
