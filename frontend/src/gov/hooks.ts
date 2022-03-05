import { useCallback, useEffect, useMemo, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection } from '@solana/wallet-adapter-react'
import { useWorkspace } from '~/workspace/hooks'
import { StakingGov, IDL as StakingGovIDL } from '~/api/types/staking_gov'
import { getStakingAccount } from '~/gov/services'

export interface NFTAccount {
  tokenAccountAddress: PublicKey
  mint: PublicKey
}

export const POOL_NAME = 'gov'
export const useNFT = (owner?: PublicKey) => {
  const [nfts, setNFTs] = useState<NFTAccount[]>([])
  const { connection } = useConnection()

  const revalidate = useCallback(async () => {
    if (!owner) {
      setNFTs([])
      return
    }

    const {
      value: splAccounts,
    } = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    })

    setNFTs(
      splAccounts
        .filter((t) => {
          const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
          const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals

          return decimals === 0 && amount >= 1
        })
        .map((t) => {
          const address = t.account?.data?.parsed?.info?.mint

          return {
            tokenAccountAddress: t.pubkey,
            mint: new PublicKey(address),
          }
        }),
    )
  }, [owner, connection])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { nfts, revalidate }
}
const useContract = (programId: anchor.web3.PublicKey) => {
  const { provider } = useWorkspace()

  const program = useMemo(() => {
    return new anchor.Program<StakingGov>(StakingGovIDL, programId, provider)
  }, [programId, provider])

  return { program }
}

export const usePoolAccount = (
  programId: anchor.web3.PublicKey,
  poolName: string,
) => {
  const { program } = useContract(programId)
  const [poolAccountInfo, setPoolAccountInfo] = useState<any>({})

  const revalidate = useCallback(async () => {
    try {
      const [
        poolAccountAddress,
      ] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(poolName), Buffer.from('pool_account')],
        program.programId,
      )

      const accountInfo = await program.account.poolAccount.fetch(
        poolAccountAddress,
      )
      setPoolAccountInfo(accountInfo)
    } catch (e) {
      setPoolAccountInfo({})
    }
  }, [program, poolName])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { poolAccountInfo, revalidate }
}

export const useStakeAccount = (
  programId: anchor.web3.PublicKey,
  tokenAccountAddress: anchor.web3.PublicKey,
) => {
  const { program } = useContract(programId)

  const [stakingAccountInfo, setStakingAccountInfo] = useState<any>({})
  const [isStaked, setIsStaked] = useState<boolean>()

  const revalidate = useCallback(async () => {
    const { isInitialized, accountInfo } = await getStakingAccount({
      provider: program.provider,
      user: program.provider.wallet.publicKey,
      nftTokenAccount: tokenAccountAddress,
      poolName: POOL_NAME,
    })

    if (!isInitialized) {
      setIsStaked(false)
      setStakingAccountInfo({})
    } else {
      setIsStaked((accountInfo as any).isBond)
      // @ts-ignore
      setStakingAccountInfo(accountInfo)
    }
  }, [program])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { stakingAccountInfo, isStaked, revalidate }
}
