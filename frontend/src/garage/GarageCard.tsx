import React, { useMemo } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import { useWorkspace } from '~/workspace/hooks'
import { useStakeAccount } from '~/hooks/useAccount'
import { shortenIfAddress } from '~/wallet/utils'
import { bond, unBond } from '~/garage/services'
import { SOLR_MINT_ADDRESS } from '~/api/solana/addresses'
import { Column } from '~/ui'
import Button from '~/ui/Button'
import Image from '~/ui/Image'
import { NFTAccount } from '~/nft/hooks'
import { POOL_NAME } from '~/api/solana/constants'
import { usePool } from '~/pool/hooks'
import { useStaker } from '~/stake-nft/hooks'

const Card = styled(Column)`
  width: 20vw;
  height: 35em;
  align-items: space-between;
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 1rem;
`

const CTAButton = styled(Button)`
  border: 1px solid #ccc;
  border-radius: 1rem;

  &:hover {
    background-color: #1a1f2e;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #ccc;
  }
`
interface Props {
  nft: NFTAccount
}
const GarageCard: React.FC<Props> = ({ nft }) => {
  const { mint, tokenAccountAddress } = nft
  const { provider, wallet } = useWorkspace()
  const {
    poolInfo,
    revalidate: revalidatePool,
    publicAddress: poolAccount,
  } = usePool()
  const {
    stakeInfo,
    isStaked,
    isInitialize,
    isLoading,
    publicAddress: stakingAccount,
    bump: stakingAccountBump,
    revalidate: revalidateStakeAccount,
  } = useStakeAccount(POOL_NAME, mint)
  const { revalidate: revalidateStaker } = useStaker()

  const toggleStake = async () => {
    if (!provider || !wallet) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    if (!poolAccount || isLoading) {
      return
    }

    if (!isStaked) {
      try {
        const tx = await bond({
          provider,
          user: wallet.publicKey,
          poolAccount,
          solrMint: SOLR_MINT_ADDRESS,
          nftMint: mint,
          nftTokenAccount: tokenAccountAddress,
          stakingAccount: stakingAccount!,
          stakingAccountBump: stakingAccountBump!,
          isInitialized: isInitialize!,
        })

        const resp = await provider.connection.confirmTransaction(tx)
        if (resp.value.err) {
          toast('Stake Failed', { type: 'error' })
        } else {
          toast('Stake Succeed', { type: 'success' })
        }

        await Promise.all([revalidatePool(), revalidateStakeAccount()])
      } catch (e) {
        console.log(e)
        toast('Stake Failed', { type: 'error' })
      }
    } else {
      try {
        const tx = await unBond({
          provider,
          user: wallet.publicKey,
          poolAccount,
          solrMint: SOLR_MINT_ADDRESS,
          stakingAccount: stakingAccount!,
        })

        const resp = await provider.connection.confirmTransaction(tx)
        if (resp.value.err) {
          toast('UnStake Failed', { type: 'error' })
        } else {
          toast('UnStake Succeed', { type: 'success' })
        }

        await Promise.all([
          revalidatePool(),
          revalidateStakeAccount(),
          revalidateStaker(),
        ])
      } catch (e) {
        console.log(e)
        toast('UnStake Failed', { type: 'error' })
      }
    }
  }

  const buttonContent = useMemo(() => {
    if (isStaked === undefined) return '...'

    if (isStaked) {
      return 'UNSTAKE'
    } else {
      return 'STAKE'
    }
  }, [isStaked])
  const { globalRewardIndex } = poolInfo || {}
  const { pendingReward, rewardIndex, isBond } = stakeInfo || {}

  const displayReward = useMemo(() => {
    if (
      globalRewardIndex === undefined ||
      pendingReward === undefined ||
      rewardIndex === undefined ||
      isBond === undefined
    ) {
      return undefined
    }
    const bondAmount = isBond ? 1 : 0

    return (
      pendingReward +
      (globalRewardIndex * bondAmount - rewardIndex * bondAmount) / 10 ** 6
    ).toFixed(2)
  }, [globalRewardIndex, pendingReward, rewardIndex, isBond])

  return (
    <Card>
      <h3>Mint: {shortenIfAddress(nft.mint.toBase58())}</h3>
      <p>ata: {shortenIfAddress(nft.tokenAccountAddress.toBase58())}</p>
      <Image
        src="/garage-template.jpeg"
        height="25em"
        style={{
          borderRadius: '1rem',
        }}
      />
      {displayReward !== undefined && <p>reward: {displayReward} SOLR </p>}
      <CTAButton onClick={toggleStake} disabled={isLoading}>
        {buttonContent}
      </CTAButton>
    </Card>
  )
}

export default GarageCard
