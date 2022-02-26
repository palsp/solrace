import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { programs } from '@metaplex/js'
import { getMetadata } from '~/api/utils'

const {
  metadata: { MetadataData },
} = programs

interface Options {
  owner: anchor.web3.PublicKey

  connection: Connection
}

export const getParsedNFTAccountByOwner = async ({
  owner,
  connection,
}: Options) => {
  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )

  return splAccounts
    .filter((t) => {
      console.log(t.account.owner.toString())
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals
      return decimals === 0 && amount >= 1
    })
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint
      return new PublicKey(address)
    })
}

// const nfts = []
// for (const meta of nftAccounts) {
//   const info = await connection.getAccountInfo(meta)
//   if (info) {
//     const meta = MetadataData.deserialize(info.data)
//     nfts.push(meta)
//   }
// }

// return nfts
