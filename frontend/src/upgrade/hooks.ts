import { useMemo, useState, useCallback, useEffect } from 'react'
import * as anchor from '@project-serum/anchor'

import { useWorkspace } from '~/workspace/hooks'
import { POOL_NAME } from '~/gov/hooks'
import {
  SolRaceStaking,
  IDL as SolRaceStakingIDL,
} from '~/api/types/sol_race_staking'

export const useKartAccount = (
  programId: anchor.web3.PublicKey,
  kartMint: anchor.web3.PublicKey,
) => {
  const { provider, wallet } = useWorkspace()
  const program = useMemo(() => {
    if (!provider) return undefined

    return new anchor.Program<SolRaceStaking>(
      SolRaceStakingIDL,
      programId,
      provider,
    )
  }, [programId, provider])

  const [publicAddress, setPublicAddress] = useState<anchor.web3.PublicKey>()
  const [accountInfo, setAccountInfo] = useState<any>({})
  const [isInitialize, setIsInitialize] = useState<boolean>()
  const [bump, setBump] = useState<number>()

  const revalidate = useCallback(async () => {
    if (!program || !wallet) return
    const [
      kartAccount,
      kartAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('kart_account'),
        Buffer.from(POOL_NAME),
        wallet.publicKey.toBuffer(),
        kartMint.toBuffer(),
      ],
      program.programId,
    )

    setPublicAddress(kartAccount)
    setBump(kartAccountBump)

    try {
      setAccountInfo(await program.account.kartAccount.fetch(kartAccount))
      setIsInitialize(true)
    } catch (e) {
      setAccountInfo({})
      setIsInitialize(false)
    }
  }, [program, wallet, kartMint])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { accountInfo, publicAddress, isInitialize, revalidate, program, bump }
}
