type ENDPOINT_NAME =
  | 'mainnet-beta'
  | 'testnet'
  | 'devnet'
  | 'localnet'
  | 'lending'

interface ENDPOINT {
  name: ENDPOINT_NAME
  label: string
  url: string
  chainId: number
}

interface User {
  id: number
  email: string
  createdAt: string
  updatedAt: string
}
