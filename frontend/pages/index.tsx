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
import { useAuth } from '~/auth/hooks'
import Link from 'next/link'
import AppLayout from '~/app/AppLayout'

const Home = () => {
  const { publicKey } = useWallet()
  const { fetchCollection, fetchNftOfOwner } = useContract()
  const { connection } = useConnection()
  const { user } = useAuth()

  useEffect(() => {
    if (publicKey) {
      getParsedNFTAccountByOwner({ owner: publicKey, connection }).then(
        (nfts) => {
          console.log(nfts)
        },
      )
    }
  }, [publicKey])

  return <AppLayout />
}

export default Home
