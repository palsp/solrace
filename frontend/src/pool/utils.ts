import { PoolInfo } from '~/api/solana/account/pool-account'
import { StakeInfo } from '~/api/solana/account/stake-account'

import { BN } from '@project-serum/anchor'

export const calculateReward = (
  stakeInfo: StakeInfo,
  poolInfo: PoolInfo,
  decimals: number,
) => {
  if (!poolInfo) return 0

  const currentTime = new BN(Date.now() / 1000)
  let distributedAmount = 0
  if (
    poolInfo.startTime.lte(currentTime) &&
    poolInfo.endTime.gte(poolInfo.lastDistributed)
  ) {
    const time = poolInfo.endTime.sub(poolInfo.startTime)

    const distributedAmountPerSec =
      poolInfo.totalDistribution.toNumber() / time.toNumber()

    const passedTime = BN.min(poolInfo.endTime, currentTime).sub(
      BN.max(poolInfo.startTime, poolInfo.lastDistributed),
    )

    distributedAmount = distributedAmountPerSec * passedTime.toNumber()
  }

  const newGlobalRewardIndex =
    poolInfo.globalRewardIndex +
    distributedAmount / poolInfo.totalStaked.toNumber()

  const bondAmount = stakeInfo.isBond ? 1 : 0

  const newReward =
    newGlobalRewardIndex * bondAmount - stakeInfo.rewardIndex * bondAmount

  return (stakeInfo.pendingReward + newReward) / 10 ** decimals
}
