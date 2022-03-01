import React, { useRef } from 'react'
import { Provider, Program } from '@project-serum/anchor'

import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react'

import { COMMITMENT, PREFLIGHT_COMMITMENT } from '~/workspace/constants'

interface IWorkspaceContext {
  provider?: Provider
  wallet?: WalletContextState
  program?: Program
}

const defaultWorkspaceContext: IWorkspaceContext = {}

export type WorkSpace = IWorkspaceContext

export const WorkspaceContext = React.createContext(defaultWorkspaceContext)

export const WorkspaceProvider: React.FC = ({ children }) => {
  const { connection } = useConnection()
  const wallet = useWallet()

  const { current: provider } = useRef(
    // @ts-ignore
    new Provider(connection, wallet, {
      preflightCommitment: PREFLIGHT_COMMITMENT,
      commitment: COMMITMENT,
    }),
  )

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
