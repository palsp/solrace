import { useCallback, useEffect, useMemo, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection } from '@solana/wallet-adapter-react'
import { useWorkspace } from '~/workspace/hooks'
import { StakingGov, IDL as StakingGovIDL } from '~/api/types/staking_gov'
import {
  SolRaceStaking,
  IDL as SolRaceStakingIDL,
} from '~/api/types/sol_race_staking'
import { getStakingAccount } from '~/gov/services'

export interface NFTAccount {
  tokenAccountAddress: PublicKey
  mint: PublicKey
}

export const POOL_NAME = 'solkart'

export const useNFT = (owner?: PublicKey) => {
  const [nfts, setNFTs] = useState<NFTAccount[]>([])
  const { connection } = useConnection()

  const revalidate = useCallback(async () => {
    console.log('revalidate nft')
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
    if (!provider) return undefined
    return new anchor.Program<SolRaceStaking>(
      SolRaceStakingIDL,
      programId,
      provider,
    )
  }, [programId, provider])

  return { program }
}

export const usePoolAccount = (
  programId: anchor.web3.PublicKey,
  poolName: string,
) => {
  const { program } = useContract(programId)
  const [poolInfo, setPoolInfo] = useState<any>({})
  const [publicAddress, setPublicAddress] = useState<PublicKey>()

  const revalidate = useCallback(async () => {
    console.log('revalidate pool account')
    if (!program) return
    try {
      const [
        poolAccountAddress,
      ] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(poolName), Buffer.from('pool_account')],
        program.programId,
      )

      setPublicAddress(poolAccountAddress)

      const accountInfo = await program.account.poolAccount.fetch(
        poolAccountAddress,
      )
      setPoolInfo(accountInfo)
    } catch (e) {
      setPoolInfo({})
    }
  }, [program, poolName])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { poolInfo, revalidate }
}

export const useStakeAccount = (
  programId: anchor.web3.PublicKey,
  garageMint: anchor.web3.PublicKey,
) => {
  const { program } = useContract(programId)
  const { wallet } = useWorkspace()

  const [stakeInfo, setStakeInfo] = useState<any>({})
  const [isStaked, setIsStaked] = useState<boolean>()
  const [isInitialize, setIsInitialize] = useState<boolean>()

  const revalidate = useCallback(async () => {
    if (!program || !wallet) return

    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(POOL_NAME),
        wallet.publicKey.toBuffer(),
        garageMint.toBuffer(),
      ],
      program.programId,
    )
    try {
      const accountInfo = await program.account.stakingAccount.fetch(
        stakingAccount,
      )
      setIsInitialize(true)
      setIsStaked(accountInfo.isBond)
      setStakeInfo(accountInfo)
    } catch (e) {
      setIsInitialize(false)
      setIsStaked(false)
      setStakeInfo({})
    }
  }, [program, wallet])

  useEffect(() => {
    revalidate()
  }, [revalidate])

  return { stakeInfo, isStaked, isInitialize, revalidate }
}
