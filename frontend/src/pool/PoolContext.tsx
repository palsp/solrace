import React, { useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { PoolInfo } from '~/api/solana/account/pool-account'
import { POOL_NAME } from '~/api/solana/constants'
import { usePoolAccount } from '~/hooks/useAccount'
import { BN } from '@project-serum/anchor'

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

  const apr = useMemo(() => {
    if (!poolInfo) return '...'

    return poolInfo.totalDistribution
      .div(new BN(10 ** 6))
      .div(poolInfo.totalStaked.mul(new BN(100)))
      .toString()
  }, [poolInfo])

  return (
    <PoolContext.Provider
      value={{ poolInfo, publicAddress, bump, revalidate, apr }}
    >
      {children}
    </PoolContext.Provider>
  )
}
