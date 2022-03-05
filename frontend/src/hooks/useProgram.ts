import { useMemo } from 'react'
import { useWorkspace } from '~/workspace/hooks'
import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

type Idl = anchor.Idl

export const useProgram = <T extends Idl>(idl: T, programId: PublicKey) => {
  const { provider } = useWorkspace()

  const program = useMemo(() => {
    if (!provider) return undefined

    return new anchor.Program<T>(idl, programId, provider)
  }, [provider, programId, idl])

  return program
}
