import React, { useCallback, useEffect, useState } from 'react'
import { SOL_RACE_STAKING_PROGRAM_ID } from '~/api/addresses'
import { SolRaceStaking, IDL } from '~/api/types/sol_race_staking'
import { useProgram } from '~/hooks/useProgram'

interface IStakerContext {
  stakerInfos: any[]
  revalidate: () => Promise<void>
}

const defaultStakerContext: IStakerContext = {
  stakerInfos: [],
  revalidate: Promise.resolve,
}
export const StakerContext = React.createContext(defaultStakerContext)

export const StakerProvider: React.FC = ({ children }) => {
  const stakingProgram = useProgram<SolRaceStaking>(
    IDL,
    SOL_RACE_STAKING_PROGRAM_ID,
  )

  const [stakerInfos, setStakerInfos] = useState<any[]>([])

  const revalidate = useCallback(async () => {
    console.log('revalidate staker ')
    if (!stakingProgram) return

    try {
      const stakeAccounts = await stakingProgram.account.stakingAccount.all()
      setStakerInfos(
        stakeAccounts.map((account) => ({
          publicKey: account.publicKey,
          ...account.account,
        })),
      )
    } catch (e) {
      console.log(e)
    }
  }, [stakingProgram])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return (
    <StakerContext.Provider
      value={{
        stakerInfos,
        revalidate,
      }}
    >
      {children}
    </StakerContext.Provider>
  )
}
