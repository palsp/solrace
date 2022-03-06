import * as anchor from '@project-serum/anchor'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection } from '@solana/web3.js'

import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
} from '~/api/solana/candy-machine/utils'

export const handleMintError = (error: any) => {
  let message = error.msg || 'Minting failed! Please try again!'
  if (!error.msg) {
    if (!error.message) {
      message = 'Transaction Timeout! Please try again.'
    } else if (error.message.indexOf('0x137')) {
      message = `SOLD OUT!`
    } else if (error.message.indexOf('0x135')) {
      message = `Insufficient funds to mint. Please fund your wallet.`
    }
  } else {
    if (error.code === 311) {
      message = `SOLD OUT!`
    } else if (error.code === 312) {
      message = `Minting period hasn't started yet.`
    }
  }

  return message
}

export const getUserBalance = async (
  user: anchor.web3.PublicKey,
  connection: Connection,
  tokenMint?: anchor.web3.PublicKey,
) => {
  if (!tokenMint) {
    const balance = await connection.getBalance(user)

    return [balance.toString(), 9]
  } else {
    const [tokenAccount] = await getAtaForMint(tokenMint, user)

    try {
      const resp = await connection.getTokenAccountBalance(tokenAccount)

      return [resp.value.amount, resp.value.decimals]
    } catch (e) {
      return ['0', 0]
    }
  }
}

export const mint = async (
  payer: anchor.web3.PublicKey,
  provider: anchor.Provider,
) => {
  const mint = anchor.web3.Keypair.generate()

  const userTokenAccountAddress = (
    await getAtaForMint(mint.publicKey, payer)
  )[0]

  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer,
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      payer,
      payer,
      mint.publicKey,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      payer,
      [],
      1,
    ),
  ]

  const transaction = new anchor.web3.Transaction()
  instructions.forEach((instruction) => transaction.add(instruction))

  return provider.send(transaction, [mint])
}
