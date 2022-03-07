import * as anchor from '@project-serum/anchor'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { AnchorWallet } from '@solana/wallet-adapter-react'

import { PublicKey } from '@solana/web3.js'

export const findATAAddress = (
  ownerAddress: PublicKey,
  splTokenMintAddress: PublicKey,
) => {
  return Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    splTokenMintAddress,
    ownerAddress,
  )
}

export const createATAAccountIx = async (
  ownerAddress: PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, anchor.web3.TransactionInstruction]> => {
  const associatedTokenAddress = await findATAAddress(
    ownerAddress,
    splTokenMintAddress,
  )

  const ix = Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    splTokenMintAddress,
    associatedTokenAddress,
    ownerAddress,
    ownerAddress,
  )

  return [associatedTokenAddress, ix]
}
