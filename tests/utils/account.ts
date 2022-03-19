import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Token } from '@solana/spl-token'
import { SolRaceCore } from '../../target/types/sol_race_core'

export const getPoolAccount = (program: Program<any>, poolName: string) => {
  return PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )
}

export const getPoolSolrAccount = (program: Program<any>, poolName: string) => {
  return PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_solr')],
    program.programId,
  )
}

export const getStakingAccount = async (
  program: Program<any>,
  poolName: string,
  garageMint: Token,
) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('staking_account'),
      Buffer.from(poolName),
      garageMint.publicKey.toBuffer(),
    ],
    program.programId,
  )
}

export const getKartAccount = async (
  program: Program<any>,
  poolName: string,
  kartMint: Token,
) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('kart_account'),
      Buffer.from(poolName),
      kartMint.publicKey.toBuffer(),
    ],
    program.programId,
  )
}

export const getPoolAccountInfo = (
  program: Program<SolRaceCore>,
  poolAccount: PublicKey,
) => {
  return program.account.poolAccount.fetch(poolAccount)
}

export const getStakingAccountInfo = (
  program: Program<SolRaceCore>,
  stakingAccount: PublicKey,
) => {
  return program.account.stakingAccount.fetch(stakingAccount)
}

export const getKartAccountInfo = (
  program: Program<SolRaceCore>,
  kartAccount: PublicKey,
) => {
  return program.account.kartAccount.fetch(kartAccount)
}
