import _ from 'lodash'
import { BN, Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { SolRaceStaking } from '~/api/solana/types/sol_race_staking'
import { formatTime } from '~/utils/time'

export interface PoolInfo {
  poolName: string
  poolAuthority: PublicKey
  garageCreator: PublicKey
  kartCreator: PublicKey
  stakingAuthority: PublicKey
  solrMint: PublicKey
  poolSolr: PublicKey
  globalRewardIndex: number

  startTime: string
  endTime: string
  lastDistribution: string
  totalStaked: BN
  totalDistribution: BN
}

type FetchPoolInfo = {
  program: Program<SolRaceStaking>
  poolName: string
}

export const fetchPoolInfo = async ({
  program,
  poolName,
}: FetchPoolInfo): Promise<[PublicKey, number, PoolInfo | undefined]> => {
  const [poolAccount, poolAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from('pool_account')],
    program.programId,
  )

  try {
    const accountInfo = await program.account.poolAccount.fetch(poolAccount)

    const {
      startTime,
      endTime,
      lastDistributed,
      ...cleanPoolInfo
    } = accountInfo
    // TODO: format ether total distribution
    return [
      poolAccount,
      poolAccountBump,
      {
        ...cleanPoolInfo,
        poolName,
        startTime: formatTime(startTime.toNumber()),
        endTime: formatTime(endTime.toNumber()),
        lastDistribution: formatTime(lastDistributed.toNumber()),
      },
    ]
  } catch (e) {
    return [poolAccount, poolAccountBump, undefined]
  }
}
