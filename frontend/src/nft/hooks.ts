import { useContext, useState, useCallback, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@solana/wallet-adapter-react'
import { NFTContext } from '~/nft/NFTContext'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const useNFT = () => useContext(NFTContext)
export interface NFTAccount {
  tokenAccountAddress: PublicKey
  mint: PublicKey
}

/**
 * @dev for mock nft ony, solana devnet is crash
 */
export const useAllNFT = (owner?: PublicKey) => {
  const [nfts, setNFTs] = useState<NFTAccount[]>([])
  const { connection } = useConnection()

  const revalidate = useCallback(async () => {
    if (!owner) {
      setNFTs([])
      return
    }

    const {
      value: splAccounts,
    } = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    })

    setNFTs(
      splAccounts
        .filter((t) => {
          const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
          const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals

          return decimals === 0 && amount >= 1
        })
        .map((t) => {
          const address = t.account?.data?.parsed?.info?.mint

          return {
            tokenAccountAddress: t.pubkey,
            mint: new PublicKey(address),
          }
        }),
    )
  }, [owner, connection])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { nfts, revalidate }
}
