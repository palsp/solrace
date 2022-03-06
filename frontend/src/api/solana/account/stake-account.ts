import _ from 'lodash'
import { Program } from '@project-serum/anchor'
import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js'
import { SolRaceStaking } from '~/api/solana/types/sol_race_staking'

import bs58 from 'bs58'

export interface StakeInfo {
  staker: PublicKey
  garageMint: PublicKey
  garageTokenAccount: PublicKey
  garageMetadataAccount: PublicKey
  garageMasterEdition: PublicKey
  isBond: boolean
  rewardIndex: number
  pendingReward: number
}

export interface Staker extends StakeInfo {
  publicAddress: PublicKey
}

type FetchStakeInfo = {
  program: Program<SolRaceStaking>
  poolName: string
  user: PublicKey
  garageMintAccount: PublicKey
}

type GetStakers = {
  program: Program<SolRaceStaking>
  filterOnlyStake?: boolean
}

export const fetchStakeInfo = async ({
  program,
  poolName,
  user,
  garageMintAccount,
}: FetchStakeInfo): Promise<[PublicKey, number, StakeInfo | undefined]> => {
  const [
    stakingAccount,
    stakingAccountBump,
  ] = await PublicKey.findProgramAddress(
    [
      Buffer.from('staking_account'),
      // TODO: delete poolName
      Buffer.from(poolName),
      user.toBuffer(),
      garageMintAccount.toBuffer(),
    ],
    program.programId,
  )

  try {
    const stakeInfo = await program.account.stakingAccount.fetch(stakingAccount)

    console.log(garageMintAccount.toBase58(), stakeInfo)
    const { pendingReward, ...cleanStakeInfo } = stakeInfo
    return [
      stakingAccount,
      stakingAccountBump,
      {
        ...cleanStakeInfo,
        pendingReward: pendingReward.toNumber(),
      },
    ]
  } catch (e) {
    return [stakingAccount, stakingAccountBump, undefined]
  }
}

const getIsStakedFilter = (): GetProgramAccountsFilter => ({
  memcmp: {
    offset:
      8 + // Discriminator
      32 + // staker
      32 + // garage_mint
      32 + // garage_token_account
      32 + // garage_metadata_account
      32, //garage_master_edition
    bytes: bs58.encode([1]),
  },
})

export const getStakers = async ({
  program,
  filterOnlyStake = true,
}: GetStakers): Promise<Staker[]> => {
  const stakeAccounts = await program.account.stakingAccount.all(
    filterOnlyStake ? [getIsStakedFilter()] : [],
  )

  return stakeAccounts.map((stakerInfo) => {
    const { publicKey, account } = stakerInfo

    const { pendingReward, ...cleanStakeInfo } = account

    return {
      ...cleanStakeInfo,
      pendingReward: pendingReward.toNumber(),
      publicAddress: publicKey,
    }
  })
}
