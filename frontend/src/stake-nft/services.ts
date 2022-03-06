import * as anchor from '@project-serum/anchor'
import { getMetadata } from '~/api/solana/utils'
import { getMasterEdition } from '~/api/solana/candy-machine'
import {
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from '~/api/solana/addresses'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { programs } from '@metaplex/js'
import {
  SolRaceCore,
  IDL as SolRaceCoreIDL,
} from '~/api/solana/types/sol_race_core'
import { Program } from '@project-serum/anchor'

// TODO: delete
export const poolName = 'hi'

const {
  metadata: { MasterEditionV1Data, MetadataData },
} = programs

type Verify = {
  provider: anchor.Provider
  wallet: AnchorWallet
  creator: anchor.web3.PublicKey
  nftMint: anchor.web3.PublicKey
  nftTokenAccount: anchor.web3.PublicKey
}

type Bond = {
  provider: anchor.Provider
  user: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  initialize?: boolean
  garageMint: anchor.web3.PublicKey
  garageTokenAccount: anchor.web3.PublicKey
}

export type StakingAccountParams = {
  user: anchor.web3.PublicKey
  garageTokenAccount: anchor.web3.PublicKey
  provider: anchor.Provider
}

const getStakeAccountInfo = async (
  program: Program<SolRaceCore>,
  publicAddress: PublicKey,
) => {
  return program.account.stakingAccount.fetch(publicAddress)
}

const getStakeAccountRPC = async (connection: Connection) => {
  const resp = connection.getProgramAccounts(SOL_RACE_CORE_PROGRAM_ID, {
    commitment: connection.commitment,
  })
}

export const verifyNFT = async ({
  provider,
  creator,
  wallet,
  nftMint,
  nftTokenAccount,
}: Verify) => {
  // const program = new anchor.Program(
  //   idl as anchor.Idl,
  //   new PublicKey(idl.metadata.address),
  //   provider,
  // )
  const program = new anchor.Program<SolRaceCore>(
    SolRaceCoreIDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
  )
  const nftMetadataAccount = await getMetadata(nftMint)
  // const mInfo = await provider.connection.getAccountInfo(nftMetadataAccount)
  // const metaData = MetadataData.deserialize(mInfo!.data)
  // console.log('metadata', metaData)

  const creatureEdition = await getMasterEdition(nftMint)
  // console.log('token', nftTokenAccount.toString())
  // console.log('metadata', nftMetadataAccount.toString())
  // console.log('edition', creatureEdition.toString())

  // const info = await provider.connection.getAccountInfo(creatureEdition)
  // const meta = MasterEditionV1Data.deserialize(info!.data)
  // console.log('master ', meta)

  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  return program.rpc.verify({
    accounts: {
      user: wallet.publicKey,
      garageMint: nftMint,
      garageTokenAccount: nftTokenAccount,
      garageMetadataAccount: nftMetadataAccount,
      creatureEdition,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      poolAccount,
    },
  })
}

export const getStakingAccount = async ({
  provider,
  user,
  garageTokenAccount,
}: StakingAccountParams) => {
  const program = new anchor.Program<SolRaceCore>(
    SolRaceCoreIDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
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

  let isInitialized = false
  let accountInfo = {}
  try {
    accountInfo = await program.account.stakingAccount.fetch(stakingAccount)
    isInitialized = true
  } catch (e) {
    isInitialized = false
  }

  return { stakingAccount, stakingAccountBump, isInitialized, accountInfo }
}

export async function bond({
  provider,
  user,
  solrMint,
  garageMint,
  garageTokenAccount,
}: Bond) {
  const program = new anchor.Program<SolRaceCore>(
    SolRaceCoreIDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
  )

  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  const masterEdition = await getMasterEdition(garageMint)
  const garageMetadataAccount = await getMetadata(garageMint)
  const {
    stakingAccount,
    stakingAccountBump,
    isInitialized,
  } = await getStakingAccount({
    provider,
    garageTokenAccount,
    user,
  })

  const transaction = new anchor.web3.Transaction()

  if (!isInitialized) {
    transaction.add(
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
        stakingAccount,
        solrMint,
        systemProgram: SystemProgram.programId,
      },
    }),
  )

  return provider.send(transaction)
}
