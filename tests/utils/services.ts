import * as anchor from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { SolRaceStaking } from '../../target/types/sol_race_staking'

type Bond = {
  user: anchor.web3.PublicKey
  program: anchor.Program<SolRaceStaking>
  solrMint: anchor.web3.PublicKey
  signers: anchor.web3.Signer[]
  poolName: string
  initialize?: boolean
  garageMint: anchor.web3.PublicKey
  garageTokenAccount: anchor.web3.PublicKey
}

type UnBond = {
  user: anchor.web3.PublicKey
  program: anchor.Program<SolRaceStaking>
  garageTokenAccount: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  signers: anchor.web3.Signer[]
  poolName: string
}

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0]
}

export const getMetadata = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0]
}

export async function bond({
  program,
  poolName,
  user,
  solrMint,
  garageMint,
  garageTokenAccount,
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

  const masterEdition = await getMasterEdition(garageMint)

  const garageMetadataAccount = await getMetadata(garageMint)

  if (initialize) {
    preInstructions.push(
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user,
          poolAccount,
          stakingAccount: stakingAccount,
          solrMint,
          garageMint,
          garageTokenAccount,
          garageMetadataAccount,
          creatureEdition: masterEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
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
      garageMint,
      garageTokenAccount,
      garageMetadataAccount,
      creatureEdition: masterEdition,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
    signers,
    preInstructions,
  })

  return [poolAccount, stakingAccount]
}

// export async function unbond({
//   program,
//   poolName,
//   user,
//   garageTokenAccount,
//   solrMint,
//   signers,
// }: UnBond): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
//   const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
//     [Buffer.from(poolName), Buffer.from('pool_account')],
//     program.programId,
//   )

//   const [
//     stakingAccount,
//     stakingAccountBump,
//   ] = await anchor.web3.PublicKey.findProgramAddress(
//     [
//       Buffer.from('staking_account'),
//       // TODO: delete poolName
//       Buffer.from(poolName),
//       user.toBuffer(),
//       garageTokenAccount.toBuffer(),
//     ],
//     program.programId,
//   )

//   await program.rpc.unBond({
//     accounts: {
//       user,
//       poolAccount,
//       stakingAccount,
//       solrMint,
//       garageMint,
//       garageTokenAccount,
//       garageMetadataAccount,
//       systemProgram: SystemProgram.programId,
//     },
//     signers,
//   })

//   return [poolAccount, stakingAccount]
// }
