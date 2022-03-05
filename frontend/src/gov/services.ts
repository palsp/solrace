import * as anchor from '@project-serum/anchor'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { SOL_RACE_STAKING_GOV_PROGRAM_ID } from '~/api/addresses'
import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
} from '~/api/solana/candy-machine/utils'
import { StakingGov, IDL as StakingGovIDL } from '~/api/types/staking_gov'
import { POOL_NAME } from '~/gov/hooks'

export const stake = async (
  payer: anchor.web3.PublicKey,
  provider: anchor.Provider,
) => {
  const mint = anchor.web3.Keypair.generate()

  const userTokenAccountAddress = (
    await getAtaForMint(mint.publicKey, payer)
  )[0]

  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer,
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      payer,
      payer,
      mint.publicKey,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      payer,
      [],
      1,
    ),
  ]

  const transaction = new anchor.web3.Transaction()
  instructions.forEach((instruction) => transaction.add(instruction))

  return provider.send(transaction, [mint])
}

type Bond = {
  provider: anchor.Provider
  user: anchor.web3.PublicKey
  solrMint: anchor.web3.PublicKey
  nftMint: anchor.web3.PublicKey
  nftTokenAccount: anchor.web3.PublicKey
}

export const bond = async ({
  provider,
  user,
  solrMint,
  nftMint,
  nftTokenAccount,
}: Bond) => {
  const program = new anchor.Program<StakingGov>(
    StakingGovIDL,
    SOL_RACE_STAKING_GOV_PROGRAM_ID,
    provider,
  )

  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(POOL_NAME), Buffer.from('pool_account')],
    program.programId,
  )

  const {
    stakingAccount,
    stakingAccountBump,
    isInitialized,
  } = await getStakingAccount({
    provider,
    nftTokenAccount,
    user,
    poolName: POOL_NAME,
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
          garageMint: nftMint,
          garageTokenAccount: nftTokenAccount,
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
        garageMint: nftMint,
        garageTokenAccount: nftTokenAccount,
        systemProgram: SystemProgram.programId,
      },
    }),
  )
  return provider.send(transaction)
}

const getNFTToken = async (
  owner: anchor.web3.PublicKey,
  connection: Connection,
) => {
  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )
  return splAccounts
    .filter((t) => {
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals
      return decimals === 0 && amount >= 1
    })
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint

      return {
        tokenAccountAddress: t.pubkey,
        mint: new PublicKey(address),
      }
    })
}

export type StakingAccountParams = {
  user: anchor.web3.PublicKey
  nftTokenAccount: anchor.web3.PublicKey
  provider: anchor.Provider
  poolName: string
}

export const getStakingAccount = async ({
  provider,
  user,
  nftTokenAccount,
  poolName,
}: StakingAccountParams) => {
  const program = new anchor.Program<StakingGov>(
    StakingGovIDL,
    SOL_RACE_STAKING_GOV_PROGRAM_ID,
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
      nftTokenAccount.toBuffer(),
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
