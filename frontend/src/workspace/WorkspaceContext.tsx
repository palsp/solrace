import React, { useMemo, useRef } from 'react'
import { Provider, Program } from '@project-serum/anchor'

import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  WalletContextState,
} from '@solana/wallet-adapter-react'

import { COMMITMENT, PREFLIGHT_COMMITMENT } from '~/workspace/constants'

interface IWorkspaceContext {
  provider?: Provider
  wallet?: AnchorWallet
  program?: Program
}

const defaultWorkspaceContext: IWorkspaceContext = {}

export type WorkSpace = IWorkspaceContext

export const WorkspaceContext = React.createContext(defaultWorkspaceContext)

export const WorkspaceProvider: React.FC = ({ children }) => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const provider = useMemo(() => {
    if (!wallet) return undefined

    return new Provider(connection, wallet, {
      preflightCommitment: PREFLIGHT_COMMITMENT,
      commitment: COMMITMENT,
    })
  }, [wallet, connection])

  return (
    <WorkspaceContext.Provider
      value={{
        provider,
        wallet,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
