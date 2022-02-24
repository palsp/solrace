import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TOKEN_METADATA_PROGRAM_ID } from 'nft/constants'
import { connection } from 'solana'
import { NFTCollection } from 'entity/NFTCollection'
import { programs } from '@metaplex/js'

const {
  metadata: { MetadataData },
} = programs

const getMetadata = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0]
}

const getParsedNFTAccountByOwner = async (owner: anchor.web3.PublicKey) => {
  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )

  return splAccounts
    .filter((t) => {
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals
      return decimals === 0 && amount >= 1
    })
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint
      return new PublicKey(address)
    })
}

export const getNFTAccountByCollection = async (owner: string) => {
  const ownerPubkey = new PublicKey(owner)

  const collections = await NFTCollection.find()
  const collectionMap: { [key: string]: NFTCollection } = {}
  collections.forEach((collection) => {
    collectionMap[collection.symbol] = collection
  })

  const userNFTAccounts: UserNFTAccount[] = []
  const userNFTAccountIndexMap: { [key: string]: number } = {}

  const nftAccounts = await getParsedNFTAccountByOwner(ownerPubkey)

  for (const nftAccount of nftAccounts) {
    const meta = await getMetadata(nftAccount)

    const info = await connection.getAccountInfo(meta)
    if (info) {
      const metaData = MetadataData.deserialize(info.data)
      const {
        data: { symbol },
      } = metaData
      const collection = collectionMap[symbol]
      if (collection) {
        const index = userNFTAccountIndexMap[symbol]
        // if 0 =  false
        if (index !== undefined) {
          userNFTAccounts[index].accounts.push(metaData)
        } else {
          userNFTAccountIndexMap[symbol] = userNFTAccounts.length
          userNFTAccounts.push({
            collection,
            accounts: [metaData],
          })
        }
      }
    }
  }

  return userNFTAccounts
}
