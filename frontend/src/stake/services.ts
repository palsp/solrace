import * as anchor from '@project-serum/anchor'
import { VERIFY_NFT_PROGRAM } from '~/api/solana/candy-machine'
import { getMetadata } from '~/api/utils'
import { getMasterEdition } from '~/api/solana/candy-machine'
import idl from '~/contract/idl/verify_nft.json'
import { getAtaForMint } from '~/api/solana/candy-machine/utils'
import { TOKEN_METADATA_PROGRAM_ID } from '~/contract/addresses'
import { PublicKey } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { programs } from '@metaplex/js'

const {
  metadata: { MasterEditionV1Data, MetadataData },
} = programs

type Verify = {
  provider: anchor.Provider
  creator: anchor.web3.PublicKey
  wallet: AnchorWallet
  nftMint: anchor.web3.PublicKey
  nftTokenAccount: anchor.web3.PublicKey
}
export const verifyNFT = async ({
  provider,
  creator,
  wallet,
  nftMint,
  nftTokenAccount,
}: Verify) => {
  const program = new anchor.Program(
    idl as anchor.Idl,
    new PublicKey(idl.metadata.address),
    provider,
  )

  const nftMetadataAccount = await getMetadata(nftMint)
  // const mInfo = await provider.connection.getAccountInfo(nftMetadataAccount)
  // const metaData = MetadataData.deserialize(mInfo!.data)
  // console.log('metadata', metaData)

  const creatureEdition = await getMasterEdition(nftMint)
  // console.log('token', nftTokenAccount.toString())
  // console.log('metadata', nftMetadataAccount.toString())
  // console.log('edition', creatureEdition.toString())

  // const info = await provider.connection.getAccountInfo(creatureEdition)
  // const meta = MasterEditionV1Data.deserialize(info!.data)
  // console.log('master ', meta)

  return program.rpc.verifyNft({
    accounts: {
      user: wallet.publicKey,
      nftMint,
      nftTokenAccount,
      nftMetadataAccount,
      creatureEdition,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      creator,
    },
  })
}
