import * as anchor from '@project-serum/anchor'
import { SystemProgram } from '@solana/web3.js'
import { SolRaceStaking } from '../../target/types/sol_race_staking'

type Stake = {
  user: anchor.web3.PublicKey
  program: anchor.Program<SolRaceStaking>
  garageTokenAccount: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  signers: anchor.web3.Signer[]
  poolName: string
  initialize?: boolean
}

export async function stake({
  program,
  poolName,
  user,
  garageTokenAccount,
  solrMint,
  signers,
  initialize = true,
}: Stake): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
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

  await program.rpc.stake({
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
