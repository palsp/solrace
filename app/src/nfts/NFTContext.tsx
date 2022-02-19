import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState } from 'react'
import { getParsedNFTAccountByOwner } from '~/api/get-nft-by-owner'

import { NFT_COLLECTIONS } from '~/nfts/constants'
import { cloneDeep } from 'lodash'
import { getMetadata } from '~/api/utils'
import { programs } from '@metaplex/js'

const {
  metadata: { MetadataData },
} = programs
interface INFTContext {}

export interface UserCollections {
  [key: string]: {
    programId: string
    accounts?: typeof MetadataData[]
  }
}

const defaultNFTContext: INFTContext = {}

export const NFTContext = React.createContext(defaultNFTContext)

export const NFTProvider: React.FC = ({ children }) => {
  const { publicKey: owner } = useWallet()
  const { connection } = useConnection()
  const [userCollections, setUserCollections] = useState<UserCollections>({})

  const fetchCollections = async () => {
    if (!owner) return
    const nftAccounts = await getParsedNFTAccountByOwner({ owner, connection })
    const userNFTs = NFT_COLLECTIONS.map(({ symbol, programId }) => [
      symbol,
      programId,
    ]).reduce((prev, curr) => {
      prev[curr[0]] = { programId: curr[1] }
      return prev
    }, {} as UserCollections)

    for (const nftAccount of nftAccounts) {
      const meta = await getMetadata(nftAccount)
      const info = await connection.getAccountInfo(meta)
      if (info) {
        const meta = MetadataData.deserialize(info.data)
        const supportCollection = NFT_COLLECTIONS.find(
          (collection) => collection.symbol === meta.data.symbol,
        )
        if (supportCollection) {
          const userCollections = userNFTs[supportCollection.symbol]
          if (!userCollections.accounts) userCollections.accounts = []

          userCollections.accounts.push(meta)
        }
      }
    }
    console.log(userNFTs)

    setUserCollections(userNFTs)
  }

  useEffect(() => {
    if (!owner) return
    fetchCollections()
  }, [owner])

  return <NFTContext.Provider value={{}}>{children}</NFTContext.Provider>
}
