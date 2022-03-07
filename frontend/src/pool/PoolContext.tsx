import React, { useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { PoolInfo } from '~/api/solana/account/pool-account'
import { POOL_NAME } from '~/api/solana/constants'
import { usePoolAccount } from '~/hooks/useAccount'
import { BN } from '@project-serum/anchor'
import { useMintInfo } from '~/hooks/useMintInfo'
import { toEther } from '~/api/solana/utils/parse-ether'
import { StakeInfo } from '~/api/solana/account/stake-account'
interface IPoolContext {
  poolInfo?: PoolInfo
  publicAddress?: PublicKey
  bump?: number
  apr: string
  revalidate: () => Promise<void>
}

const defaultPoolContext: IPoolContext = {
  apr: '...',
  revalidate: Promise.resolve,
}

export const PoolContext = React.createContext(defaultPoolContext)

export const PoolProvider: React.FC = ({ children }) => {
  const { poolInfo, publicAddress, bump, revalidate } = usePoolAccount(
    POOL_NAME,
  )

  const solrMintInfo = useMintInfo(poolInfo?.solrMint)
  const apr = useMemo(() => {
    if (!poolInfo || !solrMintInfo) return '...'

    let totalPoolShare = poolInfo.totalStaked

    if (totalPoolShare.eq(new BN('0'))) {
      totalPoolShare = new BN('1')
    }

    const time = poolInfo.endTime.sub(poolInfo.startTime)

    const secPerYear = new BN(365 * 24 * 60 * 60)

    const calculatedApr = toEther(
      poolInfo.totalDistribution,
      solrMintInfo.decimals,
    )
      .mul(secPerYear)
      .mul(new BN('100'))
      .div(time)
      .div(totalPoolShare)

    return calculatedApr.gte(new BN('20000'))
      ? '20000+'
      : calculatedApr.toString()
  }, [poolInfo, solrMintInfo])

  return (
    <PoolContext.Provider
      value={{
        poolInfo,
        publicAddress,
        bump,
        revalidate,
        apr,
      }}
    >
      {children}
    </PoolContext.Provider>
  )
}
