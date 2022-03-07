import React, { useCallback, useMemo, useRef } from 'react'
import * as anchor from '@project-serum/anchor'
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react'
import { COMMITMENT, PREFLIGHT_COMMITMENT } from '~/workspace/constants'
import { noop } from 'lodash'

interface IWorkspaceContext {
  provider: anchor.Provider
  wallet?: AnchorWallet
  program?: anchor.Program
}

const defaultWorkspaceContext: IWorkspaceContext = {
  provider: undefined as any,
}

export type WorkSpace = IWorkspaceContext

export const WorkspaceContext = React.createContext(defaultWorkspaceContext)

export const WorkspaceProvider: React.FC = ({ children }) => {
  const { connection } = useConnection()
  const wallet: any = useAnchorWallet()

  const provider = useMemo(() => {
    return new anchor.Provider(connection, wallet, {
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
