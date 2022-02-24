import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import useSWR from 'swr'

interface INFTContext {
  collections: any[]
}

const defaultNFTContext: INFTContext = {
  collections: [],
}

export const NFTContext = React.createContext(defaultNFTContext)

export const NFTProvider: React.FC = ({ children }) => {
  const { publicKey: owner } = useWallet()

  const { data: collections } = useSWR(
    owner ? `/nft/${owner.toBase58()}` : null,
  )

  return (
    <NFTContext.Provider value={{ collections: collections || [] }}>
      {children}
    </NFTContext.Provider>
  )
}
