import type { AppProps } from "next/app";
import Head from "next/head";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

/** solana */
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

/** react toastify */
import { ToastContainer } from "react-toastify";

/** SWR */
import { SWRConfig } from "swr";
import { PublicConfiguration } from "swr/dist/types";
import { fetcher } from "~/api";

/** styling */
import "react-toastify/dist/ReactToastify.css";
import GlobalStyles from "styles/GlobalStyles";

import { DEFAULT_ENDPOINT } from "~/workspace/constants";
import { WorkspaceProvider } from "~/workspace/WorkspaceContext";
import { NFTProvider } from "~/nft/NFTContext";
import { AuthProvider } from "~/auth/AuthContext";
import { LinkedWalletProvider } from "~/wallet/LinkedWalletContext";
import { GarageStakerProvider } from "~/garage-staker/GarageStakerContext";
import { PoolProvider } from "~/pool/PoolContext";

const swrOption: Partial<PublicConfiguration> = {
  fetcher,
  revalidateOnFocus: false,
};

const wallets = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
];

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// TODO: ALLOW USER TO SWITCH NETWORK
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Solrace</title>
      </Head>

      <ToastContainer />
      {/* <ConnectionProvider endpoint={DEFAULT_ENDPOINT.url}>
        <WalletProvider wallets={wallets} autoConnect>
          <SWRConfig value={swrOption}>
            <WorkspaceProvider>
              <WalletModalProvider>
                <PoolProvider>
                  <GarageStakerProvider>
                    <NFTProvider>
                      <AuthProvider>
                        <LinkedWalletProvider>
                          <GlobalStyles />
                          <Component {...pageProps} />
                        </LinkedWalletProvider>
                      </AuthProvider>
                    </NFTProvider>
                  </GarageStakerProvider>
                </PoolProvider>
              </WalletModalProvider>
            </WorkspaceProvider>
          </SWRConfig>
        </WalletProvider>
      </ConnectionProvider> */}

      <ConnectionProvider endpoint={DEFAULT_ENDPOINT.url}>
        <WalletProvider wallets={wallets} autoConnect>
          <SWRConfig value={swrOption}>
            <WorkspaceProvider>
              <WalletModalProvider>
                <GlobalStyles />
                <Component {...pageProps} />
              </WalletModalProvider>
            </WorkspaceProvider>
          </SWRConfig>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default MyApp;
