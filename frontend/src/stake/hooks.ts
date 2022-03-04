import { PublicKey } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { getStakingAccount } from '~/stake/services'
import { useWorkspace } from '~/workspace/hooks'

export const useStakingAccount = (tokenAccountAddress: string) => {
  const [stakingAccountInfo, setStakingAccountInfo] = useState<any>({})
  const { provider, wallet } = useWorkspace()
  const [isStaked, setIsStaked] = useState<boolean>()

  const revalidate = useCallback(async () => {
    if (!provider || !wallet) {
      return
    }

    const { isInitialized, accountInfo } = await getStakingAccount({
      provider,
      garageTokenAccount: new PublicKey(tokenAccountAddress),
      user: wallet.publicKey,
    })

    if (!isInitialized) {
      setIsStaked(false)
    } else {
      setIsStaked((accountInfo as any).isBond)
      setStakingAccountInfo(accountInfo)
    }
  }, [provider, wallet, tokenAccountAddress])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return {
    stakingAccountInfo,
    isStaked,
    revalidate,
  }
}
