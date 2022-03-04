import { useMemo, useState, useCallback, useEffect } from 'react'
import { SolRaceStaking, IDL } from '~/api/types/sol_race_staking'
import stakingIDL from '~/api/idl/sol_race_staking.json'

import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useWorkspace } from '~/workspace/hooks'
import { getStakingAccount } from '~/stake/services'

export type PoolAccount = typeof IDL.accounts[0]
export type StakingAccount = typeof IDL.accounts[1]

const useContract = (programId: anchor.web3.PublicKey) => {
  const { provider } = useWorkspace()

  const program = useMemo(() => {
    return new anchor.Program<SolRaceStaking>(IDL, programId, provider)
  }, [programId, provider])

  return { program }
}

export const usePoolAccount = (
  programId: anchor.web3.PublicKey,
  poolName: string,
) => {
  const { program } = useContract(programId)
  const [poolAccountInfo, setPoolAccountInfo] = useState<any>()

  const revalidate = useCallback(async () => {
    try {
      const [
        poolAccountAddress,
      ] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(poolName), Buffer.from('pool_account')],
        program.programId,
      )

      const accountInfo = await program.account.poolAccount.fetch(
        poolAccountAddress,
      )

      // @ts-ignore
      setPoolAccountInfo(accountInfo)
    } catch (e) {
      setPoolAccountInfo(undefined)
    }
  }, [program, poolName])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { poolAccountInfo, revalidate }
}

export const useStakeAccount = (
  programId: anchor.web3.PublicKey,
  tokenAccountAddress: anchor.web3.PublicKey,
) => {
  const { program } = useContract(programId)

  const [stakingAccountInfo, setStakingAccountInfo] = useState<any>()
  const [isStaked, setIsStaked] = useState<boolean>()

  const revalidate = useCallback(async () => {
    const { isInitialized, accountInfo } = await getStakingAccount({
      provider: program.provider,
      user: program.provider.wallet.publicKey,
      garageTokenAccount: tokenAccountAddress,
    })

    if (!isInitialized) {
      setIsStaked(false)
    } else {
      setIsStaked((accountInfo as any).isBond)
      // @ts-ignore
      setStakingAccountInfo(accountInfo)
    }
  }, [program])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { stakingAccountInfo, isStaked, revalidate }
}
