import { PublicKey } from '@solana/web3.js'
import { NFTCollection } from 'entity/NFTCollection'
import { NFT_COLLECTIONS } from 'nft/constants'
import { getMetadata, getParsedNFTAccountByOwner } from 'nft/services'
import { connection, solraceProgram } from 'solana'
import { KART_CM_ID } from 'solana/addresses'
import { programs } from '@metaplex/js'

const {
  metadata: { MetadataData },
} = programs

interface Karts {
  [tokenAccount: string]: any
}

export type KartFromProgram = ReturnType<
  typeof solraceProgram.account.kartAccount.fetch
>

export const getKartOfOwner = async (owner: string): Promise<Karts> => {
  const ownerPubkey = new PublicKey(owner)

  const collection = await NFTCollection.findOne({
    candyMachineId: KART_CM_ID.toBase58(),
  })

  if (!collection) {
    return {}
  }

  const karts: Karts = {}

  const nftAccounts = await getParsedNFTAccountByOwner(ownerPubkey)
  for (const { mint, tokenAccountAddress } of nftAccounts) {
    const metadataPubkey = await getMetadata(mint)

    const rawMetadata = await connection.getAccountInfo(metadataPubkey)
    if (!rawMetadata) continue

    const metadata = MetadataData.deserialize(rawMetadata.data)

    if (collection.expectedCreatorAddress) {
      // check by expected creator
      const hasCreator = metadata.data.creators.find(
        (creator) =>
          creator.address.toLowerCase() ===
          collection.expectedCreatorAddress?.toLowerCase(),
      )

      if (!hasCreator) continue

      karts[tokenAccountAddress.toBase58()] = metadata
    }
  }

  return karts
}

export const getUpgradedKartOfOwner = (ownerPublicAddress: string) => {
  return solraceProgram.account.kartAccount.all([
    {
      memcmp: {
        offset: 8, // DISCRIMINATOR
        bytes: ownerPublicAddress,
      },
    },
  ])
}
