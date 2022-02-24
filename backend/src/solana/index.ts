import { Connection, clusterApiUrl } from '@solana/web3.js'

const clusterUrl =
  process.env.SOLANA_CLUSTER_URL || clusterApiUrl('mainnet-beta')

export const connection = new Connection(clusterUrl, 'processed')
