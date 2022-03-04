import * as anchor from '@project-serum/anchor'
import { SystemProgram } from '@solana/web3.js'
import { SolRaceStaking } from '../../target/types/sol_race_staking'

type Bond = {
  user: anchor.web3.PublicKey
  program: anchor.Program<SolRaceStaking>
  garageTokenAccount: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  signers: anchor.web3.Signer[]
  poolName: string
  initialize?: boolean
}

type UnBond = {
  user: anchor.web3.PublicKey
  program: anchor.Program<SolRaceStaking>
  garageTokenAccount: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  signers: anchor.web3.Signer[]
  poolName: string
}

export async function bond({
  program,
  poolName,
  user,
  garageTokenAccount,
  solrMint,
  signers,
  initialize = true,
}: Bond): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  const [
    stakingAccount,
    stakingAccountBump,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('staking_account'),
      // TODO: delete poolName
      Buffer.from(poolName),
      user.toBuffer(),
      garageTokenAccount.toBuffer(),
    ],
    program.programId,
  )

  const preInstructions = []

  if (initialize) {
    preInstructions.push(
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user,
          poolAccount,
          stakingAccount: stakingAccount,
          solrMint,
          garageTokenAccount: garageTokenAccount,
          systemProgram: SystemProgram.programId,
        },
        signers,
      }),
    )
  }

  await program.rpc.bond({
    accounts: {
      user,
      poolAccount,
      stakingAccount,
      solrMint,
      garageTokenAccount,
      systemProgram: SystemProgram.programId,
    },
    signers,
    preInstructions,
  })

  return [poolAccount, stakingAccount]
}

export async function unbond({
  program,
  poolName,
  user,
  garageTokenAccount,
  solrMint,
  signers,
}: UnBond): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  const [
    stakingAccount,
    stakingAccountBump,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('staking_account'),
      // TODO: delete poolName
      Buffer.from(poolName),
      user.toBuffer(),
      garageTokenAccount.toBuffer(),
    ],
    program.programId,
  )

  await program.rpc.unBond({
    accounts: {
      user,
      poolAccount,
      stakingAccount,
      solrMint,
      garageTokenAccount,
      systemProgram: SystemProgram.programId,
    },
    signers,
  })

  return [poolAccount, stakingAccount]
}