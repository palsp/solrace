import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import * as serumCmn from '@project-serum/common'

import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

function sleep(ms: number) {
  console.log('Sleeping for', ms / 1000, 'seconds')
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getTokenAccount(
  provider: serumCmn.Provider,
  addr: anchor.web3.PublicKey,
) {
  return await serumCmn.getTokenAccount(provider, addr)
}

async function createMint(
  provider: serumCmn.Provider,
  decimals = 6,
  authority?: anchor.web3.PublicKey,
  freezeAuthority?: anchor.web3.PublicKey,
) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey
  }
  const mint = await spl.Token.createMint(
    provider.connection,
    // @ts-ignore
    provider.wallet.payer,
    authority,
    freezeAuthority,
    decimals,
    TOKEN_PROGRAM_ID,
  )
  return mint
}

async function createTokenAccount(
  provider,
  mint: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
) {
  const token = new spl.Token(
    provider.connection,
    mint,
    TOKEN_PROGRAM_ID,
    provider.wallet.payer,
  )
  let vault = await token.createAccount(owner)
  return vault
}

export { sleep, getTokenAccount, createTokenAccount, createMint }
