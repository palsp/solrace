import fs from 'fs'
import * as anchor from '@project-serum/anchor'
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import { getTokenAccount } from '@project-serum/common'

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
)

export function loadedKeypair(keypair): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!')
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
  )
  return loaded
}

const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
) => {
  return Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    owner,
  )
}

export const createATAAccount = async (
  provider: anchor.Provider,
  mint: PublicKey,
  owner: PublicKey,
) => {
  const ata = await getAtaForMint(mint, owner)
  let isInitialize = false
  try {
    await getTokenAccount(provider, ata)
    isInitialize = true
  } catch (e) {
    isInitialize = false
  }
  if (!isInitialize) {
    console.log('not initialize')
    const tx = new web3.Transaction()
    const createATAIX = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      ata,
      owner,
      provider.wallet.publicKey,
    )

    tx.add(createATAIX)
    await provider.send(tx)
  } else {
    console.log('skip: already initialized')
  }

  return ata
}
