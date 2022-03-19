import fs from 'fs'
import * as anchor from '@project-serum/anchor'
import {
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createATAAccount, loadedKeypair } from '../utils'
import { Faucet, IDL } from '../../target/types/faucet'
import { getTokenAccount } from '@project-serum/common'

const clusterUrl = clusterApiUrl('devnet')
// const clusterUrl = 'http://localhost:8899'

function Bumps() {
  this.faucetAccount
  this.tokenMint
}

export const deployFaucet = async () => {
  const args = process.argv.slice(2)
  let tokenName: string
  let decimals: string
  for (let i = 0; i < args.length; i += 2) {
    const opt = args[i]
    const val = args[i + 1]

    switch (opt) {
      case '--name':
        tokenName = val
        break
      case '--decimals':
        decimals = val
        break
    }
  }

  if (!tokenName) {
    throw new Error('--name is required')
  }

  if (!decimals) {
    throw new Error('--decimals is required')
  }

  if (isNaN(+decimals)) {
    throw new Error('--decimals must be a number')
  }

  const keypair = loadedKeypair(
    '/Users/supasinliulaks/.config/solana/devnet.json',
  )

  const { publicKey: programId } = loadedKeypair(
    'target/deploy/faucet-keypair.json',
  )

  const connection = new anchor.web3.Connection(clusterUrl)
  const wallet = new anchor.Wallet(keypair)
  const provider = new anchor.Provider(connection, wallet, {
    preflightCommitment: 'processed',
  })
  const program = new anchor.Program<Faucet>(IDL, programId, provider)

  const [faucetAccount, faucetAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName)],
    program.programId,
  )
  const [tokenMint, tokenMintBump] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName), Buffer.from('token_mint')],
    program.programId,
  )

  const bumps = new Bumps()
  bumps.faucetAccount = faucetAccountBump
  bumps.tokenMint = tokenMintBump
  let isInitialized = false
  try {
    await program.account.faucetAccount.fetch(faucetAccount)
    isInitialized = true
  } catch (e) {
    isInitialized = false
  }

  if (!isInitialized) {
    await program.rpc.initialize(tokenName, bumps, decimals, {
      accounts: {
        faucetAuthority: provider.wallet.publicKey,
        faucetAccount,
        tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
  } else {
    console.log('skip: faucet already initialized')
  }
  console.log(`${tokenName} mint: ${tokenMint.toBase58()}`)
  console.log(`faucet account: ${faucetAccount.toBase58()}`)

  const poolAuthority = await createATAAccount(
    provider,
    tokenMint,
    provider.wallet.publicKey,
  )

  await program.rpc.mint(new anchor.BN(1_000_000_000_000_000), {
    accounts: {
      userAuthority: provider.wallet.publicKey,
      faucetAccount,
      tokenMint,
      userTokenAccount: poolAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  })

  console.log(`pool authority: ${poolAuthority.toBase58()}`)

  const tokenInfo = await getTokenAccount(provider, poolAuthority)
  console.log(
    `pool authority has ${tokenInfo.amount.div(
      new anchor.BN(10).pow(new anchor.BN(decimals)),
    )}`,
  )
}

deployFaucet()
