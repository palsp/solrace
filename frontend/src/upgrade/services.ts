import * as anchor from '@project-serum/anchor'
import { PublicKey, Transaction } from '@solana/web3.js'
import { TOKEN_METADATA_PROGRAM_ID } from '~/api/addresses'
import { SolRaceStaking } from '~/api/types/sol_race_staking'
import { POOL_NAME } from '~/gov/hooks'

interface UpgradeKart {
  program: anchor.Program<SolRaceStaking>
  provider: anchor.Provider
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
  program,
  provider,
  kartMint,
  kartAccount,
  kartAccountBump,
  kartTokenAccount,
  stakingAccount,
  isInitialize,
}: UpgradeKart) => {
  const transaction = new Transaction()

  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(POOL_NAME), Buffer.from('pool_account')],
    program.programId,
  )

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
