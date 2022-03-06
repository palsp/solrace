import '../config/env'
import fs from 'fs'
import log from 'loglevel'
import { Keypair, clusterApiUrl } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'

import { Program } from '@project-serum/anchor'
import { SolRaceCore, IDL } from './types/sol_race_core'

export function loadWalletKey(keypair): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!')
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
  )
  log.info(`wallet public key: ${loaded.publicKey}`)
  return loaded
}

export async function loadStakingProgram(
  walletKeyPair: Keypair,
  env: string,
  customRpcUrl?: string,
): Promise<Program<SolRaceCore>> {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl)

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || clusterApiUrl(env),
  )

  const walletWrapper = new anchor.Wallet(walletKeyPair)
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  })

  const program = new anchor.Program<SolRaceCore>(
    IDL,
    process.env.SOL_RACE_STAKING_PROGRAM_ID,
    provider,
  )

  log.debug('program id from anchor', program.programId.toBase58())
  return program
}
