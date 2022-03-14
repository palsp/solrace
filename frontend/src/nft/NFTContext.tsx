import { useWallet } from '@solana/wallet-adapter-react'
import React, { useCallback } from 'react'
import useSWR from 'swr'

import { programs } from '@metaplex/js'
const {
  metadata: { MetadataData },
} = programs
export interface NFTCollection {
  collection?: {
    id: string
    baseUri: string
  }
  accounts: NFTAccountData[]
}

export interface NFTAccountData {
  tokenAccountAddress: string
  mint: string
  data: typeof MetadataData
}

interface INFTContext {
  collections: NFTCollection[]
  getNFTOfCollection: (collectionName: string) => NFTAccountData[]
  revalidateNFTs: () => Promise<void>
}

const defaultNFTContext: INFTContext = {
  collections: [],
  getNFTOfCollection: (collectionName: string) => [],
  revalidateNFTs: Promise.resolve,
}

export const NFTContext = React.createContext(defaultNFTContext)

export const NFTProvider: React.FC = ({ children }) => {
  const { publicKey: owner } = useWallet()
  const { data: collections, mutate: revalidateNFTs } = useSWR(
    owner ? `/nft/${owner.toBase58()}` : null,
  )

  const getNFTOfCollection = useCallback(
    (collectionName: string): NFTAccountData[] => {
      if (!collections) return []

      const collection = collections.find(
        (col: any) => col.collection.name === collectionName,
      )
      return collection?.accounts || []
    },
    [collections],
  )

  return (
    <NFTContext.Provider
      value={{
        collections: collections || [],
        getNFTOfCollection,
        revalidateNFTs,
      }}
    >
      {children}
    </NFTContext.Provider>
  )
}
