import React, { useCallback, useEffect, useState } from 'react'
import { getStakers, Staker } from '~/api/solana/account/stake-account'
import { SOL_RACE_STAKING_PROGRAM_ID } from '~/api/solana/addresses'
import { SolRaceStaking, IDL } from '~/api/solana/types/sol_race_staking'
import { useProgram } from '~/hooks/useProgram'

interface IStakerContext {
  stakers: Staker[]
  revalidate: () => Promise<void>
}

const defaultStakerContext: IStakerContext = {
  stakers: [],
  revalidate: Promise.resolve,
}
export const StakerContext = React.createContext(defaultStakerContext)

export const StakerProvider: React.FC = ({ children }) => {
  const program = useProgram<SolRaceStaking>(IDL, SOL_RACE_STAKING_PROGRAM_ID)

  const [stakers, setStakers] = useState<Staker[]>([])

  const revalidate = useCallback(async () => {
    try {
      setStakers(await getStakers({ program }))
    } catch (e) {
      setStakers([])
    }
  }, [program])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return (
    <StakerContext.Provider
      value={{
        stakers,
        revalidate,
      }}
    >
      {children}
    </StakerContext.Provider>
  )
}
