import { solraceProgram } from 'solana'

export const getKartOfOwner = (ownerPublicAddress: string) => {
  return solraceProgram.account.kartAccount.all([
    {
      memcmp: {
        offset: 8, // DISCRIMINATOR
        bytes: ownerPublicAddress,
      },
    },
  ])
}
