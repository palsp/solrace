import React, { useRef } from 'react'
import { Provider, Program, Idl, Wallet } from '@project-serum/anchor'
import candyMachineIdl from '~/utils/idl/candy_machine.json'

import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react'

import {
  CANDY_MACHINE_PROGRAM_ID,
  COMMITMENT,
  PREFLIGHT_COMMITMENT,
} from '~/workspace/constants'

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

  const { current: program } = useRef(
    new Program(candyMachineIdl as Idl, CANDY_MACHINE_PROGRAM_ID, provider),
  )

  return (
    <WorkspaceContext.Provider
      value={{
        provider,
        program,
        wallet,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
