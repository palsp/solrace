require('./config/env')

const rootDir = process.env.NODE_PATH || 'src'

const migrations = ['migration/*.ts']

module.exports = {
  type: 'postgres',
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'solana_hack_nft_dev',
  logging: false,
  entities: [`${rootDir}/entity/**/!(*.test.*)`],
  subscribers: [`${rootDir}/subscriber/**/!(*.test.*)`],
  migrations,
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'migration',
  },
}
