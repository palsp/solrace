import { clusterApiUrl } from '@solana/web3.js'
import { ENV as ChainId } from '@solana/spl-token-registry'

export const ENDPOINTS: Array<ENDPOINT> = [
  {
    name: 'mainnet-beta',
    label: 'mainnet-beta',
    url: 'https://api.metaplex.solana.com/',
    chainId: ChainId.MainnetBeta,
  },
  {
    name: 'testnet',
    label: 'testnet',
    url: clusterApiUrl('testnet'),
    chainId: ChainId.Testnet,
  },
  {
    name: 'devnet',
    label: 'devnet',
    url: clusterApiUrl('devnet'),
    chainId: ChainId.Devnet,
  },
]

export const DEFAULT_ENDPOINT = ENDPOINTS[2]
