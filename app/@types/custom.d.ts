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
