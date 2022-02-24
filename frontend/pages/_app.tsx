import type { AppProps } from 'next/app'

/** solana */
import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

/** react toastify */
import { ToastContainer } from 'react-toastify'

/** SWR */
import { SWRConfig } from 'swr'
import { PublicConfiguration } from 'swr/dist/types'
import { fetcher } from '~/api'

/** styling */
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import { DEFAULT_ENDPOINT } from '~/workspace/constants'
import { WorkspaceProvider } from '~/workspace/WorkspaceContext'
import { NFTProvider } from '~/nft/NFTContext'
import { AuthProvider } from '~/auth/AuthContext'
import { LinkedWalletProvider } from '~/wallet/LinkedWalletContext'

const swrOption: Partial<PublicConfiguration> = {
  fetcher,
  revalidateOnFocus: false,
}

const wallets = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
]

// TODO: ALLOW USER TO SWITCH NETWORK
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <ConnectionProvider endpoint={DEFAULT_ENDPOINT.url}>
        <WalletProvider wallets={wallets} autoConnect>
          <SWRConfig value={swrOption}>
            <WorkspaceProvider>
              <WalletModalProvider>
                <NFTProvider>
                  <AuthProvider>
                    <LinkedWalletProvider>
                      <Component {...pageProps} />
                    </LinkedWalletProvider>
                  </AuthProvider>
                </NFTProvider>
              </WalletModalProvider>
            </WorkspaceProvider>
          </SWRConfig>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}

export default MyApp
