import * as anchor from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import {
  SOL_RACE_STAKING_GOV_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from '~/api/solana/addresses'
import { SolRaceStaking, IDL } from '~/api/solana/types/sol_race_staking'
type Bond = {
  provider: anchor.Provider
  poolAccount: PublicKey
  user: PublicKey
  solrMint: PublicKey
  nftMint: PublicKey
  nftTokenAccount: PublicKey
  stakingAccount: PublicKey
  stakingAccountBump: number
  isInitialized: boolean
}

type UnBond = {
  provider: anchor.Provider
  poolAccount: PublicKey
  user: PublicKey
  stakingAccount: PublicKey
  solrMint: PublicKey
}

export const bond = async ({
  provider,
  user,
  poolAccount,
  solrMint,
  nftMint,
  nftTokenAccount,
  stakingAccount,
  stakingAccountBump,
  isInitialized,
}: Bond) => {
  const program = new anchor.Program<SolRaceStaking>(
    IDL,
    SOL_RACE_STAKING_GOV_PROGRAM_ID,
    provider,
  )

  const transaction = new anchor.web3.Transaction()

  if (!isInitialized) {
    const garageMetadataAccount = anchor.web3.Keypair.generate().publicKey
    const creatureEdition = anchor.web3.Keypair.generate().publicKey
    transaction.add(
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user,
          poolAccount,
          stakingAccount: stakingAccount,
          solrMint,
          garageMint: nftMint,
          garageTokenAccount: nftTokenAccount,
          garageMetadataAccount,
          creatureEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
      }),
    )
  } else {
    console.log('already initialize skip ')
  }

  transaction.add(
    program.instruction.bond({
      accounts: {
        user,
        poolAccount,
        stakingAccount: stakingAccount,
        solrMint,
        systemProgram: SystemProgram.programId,
      },
    }),
  )
  return provider.send(transaction)
}

export const unBond = async ({
  provider,
  poolAccount,
  user,
  stakingAccount,
  solrMint,
}: UnBond) => {
  const program = new anchor.Program<SolRaceStaking>(
    IDL,
    SOL_RACE_STAKING_GOV_PROGRAM_ID,
    provider,
  )

  return program.rpc.unBond({
    accounts: {
      user,
      poolAccount,
      stakingAccount,
      solrMint,
      systemProgram: SystemProgram.programId,
    },
  })
}
