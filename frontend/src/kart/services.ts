import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from '~/api/solana/addresses'
import { IDL, SolRaceCore } from '~/api/solana/types/sol_race_core'
import { POOL_NAME } from '~/api/solana/constants'
interface UpgradeKart {
  provider: anchor.Provider
  poolAccount: PublicKey
  kartMint: PublicKey
  kartAccount: PublicKey
  kartAccountBump: number
  kartTokenAccount: PublicKey
  stakingAccount: PublicKey
  // kartMetadataAccount: PublicKey,
  // creatureEdition: PublicKey,
  isInitialize: boolean
}

export const upgradeKart = async ({
  provider,
  kartMint,
  poolAccount,
  kartAccount,
  kartAccountBump,
  kartTokenAccount,
  stakingAccount,
  isInitialize,
}: UpgradeKart) => {
  const program = new Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
  )
  const transaction = new Transaction()

  if (!isInitialize) {
    // TODO: fetch real meta
    const kartMetadataAccount = anchor.web3.Keypair.generate().publicKey
    const creatureEdition = anchor.web3.Keypair.generate().publicKey
    transaction.add(
      program.instruction.initKart(kartAccountBump, {
        accounts: {
          user: provider.wallet.publicKey,
          poolAccount,
          kartAccount,
          kartMint,
          kartTokenAccount,
          kartMetadataAccount,
          creatureEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      }),
    )
  }

  transaction.add(
    program.instruction.upgradeKart({
      accounts: {
        user: provider.wallet.publicKey,
        poolAccount,
        kartAccount,
        stakingAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    }),
  )

  return provider.send(transaction)
}
