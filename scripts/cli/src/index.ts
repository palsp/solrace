import '../config/env'

import * as anchor from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'
import { loadStakingProgram, loadWalletKey } from './account'
import { prompt } from './helper'
import { createMint, createTokenAccount, getTokenAccount } from './utils'

const SUPPORT_ENV = ['devnet', 'testnet']

const garageCreator = new PublicKey(
  'BrdAi9KnJrMMjjRAMBr4QLft2PpEyR3L6wp2ruceovhS',
)
const kartCreator = new PublicKey(
  '7uGWKJKxKvxE1Hx5G4L9WMoUJyXcYjoqtpRg27kErVZk',
)

export const initialize = async () => {
  const env = await prompt('which network [devnet, testnet] ? > ')

  if (!SUPPORT_ENV.includes(env)) {
    throw new Error(`${env} not supported`)
  }

  const walletKeypair = loadWalletKey(
    '/Users/supasinliulaks/.config/solana/devnet.json',
  )
  const program = await loadStakingProgram(walletKeypair, env)

  const connection = new Connection(clusterApiUrl(env as Cluster), {
    commitment: 'processed',
  })

  const wallet = new anchor.Wallet(walletKeypair)
  const provider = new anchor.Provider(connection, wallet, {
    commitment: 'processed',
  })
  const solrMint = await createMint(provider)
  console.log(`solr mint address : ${solrMint.toBase58()}`)
  // 20k per 7 days => 1m per years
  // default to 6 decimals places
  const solrAmount = new anchor.BN(1_000_000_000)

  const poolAuthority = await createTokenAccount(
    provider,
    solrMint,
    provider.wallet.publicKey,
  )
  console.log(`pool authority: ${poolAuthority.toBase58()}`)

  spl.mintTo(
    provider.connection,
    // @ts-ignore
    provider.wallet.payer,
    solrMint,
    poolAuthority,
    provider.wallet.publicKey,
    solrAmount.toNumber(),
    [],
  )

  console.log('mint to pool authority')

  // distribute for one year
  const startTime = new anchor.BN(Date.now() / 1000)
  const endTime = startTime.add(new anchor.BN(365 * 24 * 60 * 60))
  const time = endTime.sub(startTime)
  const distributedPerSec = solrAmount.div(time)
  console.log(`distribute ${distributedPerSec} solr per sec`)

  const poolName = await prompt('Pool name > ')

  const [
    poolAccount,
    poolAccountBump,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  console.log(`pool account ${poolAccount.toBase58()}(${poolAccountBump})`)

  const [
    poolSolr,
    poolSolrBump,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_solr')],
    program.programId,
  )

  console.log(`pool solr ${poolSolr.toBase58()}(${poolSolrBump})`)

  const bumps = {
    poolAccount: poolAccountBump,
    poolSolr: poolSolrBump,
  }

  await program.rpc.initialize(
    poolName,
    bumps,
    solrAmount,
    startTime,
    endTime,
    {
      accounts: {
        signer: provider.wallet.publicKey,
        poolAccount,
        stakingAuthority: provider.wallet.publicKey,
        poolAuthority,
        solrMint,
        garageCreator,
        kartCreator,
        poolSolr,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    },
  )

  // p.rpc.initialize({})
}

initialize()
