import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { MintInfo } from '@solana/spl-token'
import { getMintInfo } from '@project-serum/common'
import { useWorkspace } from '~/workspace/hooks'

export const useMintInfo = (mint?: PublicKey) => {
  const { provider } = useWorkspace()
  const [mintInfo, setMintInfo] = useState<MintInfo>()

  useEffect(() => {
    if (!mint || !provider) return

    getMintInfo(provider, mint)
      .then(setMintInfo)
      .catch(() => setMintInfo(undefined))
  }, [mint, provider])

  return mintInfo
}
