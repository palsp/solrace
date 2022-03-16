import React, { useCallback, useEffect, useState } from 'react'
import { getStakers, Staker } from '~/api/solana/account/stake-account'
import { SOL_RACE_CORE_PROGRAM_ID } from '~/api/solana/addresses'
import { SolRaceCore, IDL } from '~/api/solana/types/sol_race_core'
import { useProgram } from '~/hooks/useProgram'

interface IGarageStakerContext {
  stakers: Staker[]
  revalidate: () => Promise<void>
}

const defaultGarageStakerContext: IGarageStakerContext = {
  stakers: [],
  revalidate: Promise.resolve,
}
export const GarageStakerContext = React.createContext(
  defaultGarageStakerContext,
)

export const GarageStakerProvider: React.FC = ({ children }) => {
  const program = useProgram<SolRaceCore>(IDL, SOL_RACE_CORE_PROGRAM_ID)

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
    <GarageStakerContext.Provider
      value={{
        stakers,
        revalidate,
      }}
    >
      {children}
    </GarageStakerContext.Provider>
  )
}
