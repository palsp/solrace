import { useEffect } from 'react'
import { useContract } from '~/hooks/useContract'
import { PublicKey } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { COLLECTION_PROGRAM_ID } from '~/utils/contract'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { getParsedNFTAccountByOwner } from '~/api/get-nft-by-owner'

const Home = () => {
  const { publicKey } = useWallet()
  const { fetchCollection, fetchNftOfOwner } = useContract()
  const { connection } = useConnection()

  useEffect(() => {
    if (publicKey) {
      getParsedNFTAccountByOwner({ owner: publicKey, connection }).then(
        (nfts) => {
          console.log(nfts)
        },
      )
    }
  }, [publicKey])

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  )
}

export default Home
