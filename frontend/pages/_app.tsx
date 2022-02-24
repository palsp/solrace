import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'
import { DEFAULT_ENDPOINT } from '~/connections/constants'
import { WorkspaceProvider } from '~/workspace/WorkspaceContext'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { NFTProvider } from '~/nfts/NFTContext'
import { AuthProvider } from '~/auth/AuthContext'

const wallets = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
]

const endpoint = DEFAULT_ENDPOINT
const network = endpoint.name

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={endpoint.url}>
      <WalletProvider wallets={wallets} autoConnect>
        <WorkspaceProvider>
          <WalletModalProvider>
            <NFTProvider>
              <AuthProvider>
                <Component {...pageProps} />
              </AuthProvider>
            </NFTProvider>
          </WalletModalProvider>
        </WorkspaceProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default MyApp
