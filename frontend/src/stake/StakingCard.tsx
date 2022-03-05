import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { api } from '~/api'
import { Column } from '~/ui'
import Image from '~/ui/Image'
import Button from '~/ui/Button'
import { useWorkspace } from '~/workspace/hooks'
import { toast } from 'react-toastify'
import { bond, getStakingAccount, verifyNFT } from '~/stake/services'
import { PublicKey } from '@solana/web3.js'

import { SOLR_MINT_ADDRESS, SOL_RACE_STAKING_PROGRAM_ID } from '~/api/addresses'
import { useStakeAccount } from '~/hooks/useAccount'
import * as anchor from '@project-serum/anchor'
import { toEther } from '~/api/utils/parse-ether'

const Card = styled(Column)`
  width: 20vw;
  height: 40vh;
  justify-content: space-between;
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
  account: any
  poolAccountInfo: any
  candyMachineID?: string
  revalidatePool: () => Promise<void>
}

const StakingCard: React.FC<Props> = ({
  account,
  candyMachineID,
  poolAccountInfo,
  revalidatePool,
}) => {
  const { tokenAccountAddress, data, mint } = account
  const { provider, wallet } = useWorkspace()
  const { uri } = data
  const [imageURI, setImageURI] = useState<string>()
  const { stakingAccountInfo, isStaked, revalidate } = useStakeAccount(
    SOL_RACE_STAKING_PROGRAM_ID,
    new PublicKey(tokenAccountAddress),
  )

  const loadMetadata = async (targetUri: string) => {
    const { data: metadata } = await api.get(targetUri)

    setImageURI(metadata.image)
  }

  useEffect(() => {
    loadMetadata(uri)
  }, [uri])

  const verify = async () => {
    if (!provider || !wallet) {
      toast('Please connect your wallet', { type: 'warning' })
      return
    }

    if (!candyMachineID) {
      return
    }

    try {
      const tx = await verifyNFT({
        provider,
        wallet: wallet,
        creator: new PublicKey(candyMachineID),
        nftMint: new PublicKey(mint),
        nftTokenAccount: new PublicKey(tokenAccountAddress),
      })
      const resp = await provider.connection.confirmTransaction(tx)
      if (resp.value.err) {
        toast('Verification Failed', { type: 'error' })
      } else {
        toast('Your NFT is verified', { type: 'success' })
      }

      await revalidate()
      await revalidatePool()
    } catch (e) {
      console.log(e)
      toast('Verification Failed', { type: 'error' })
    }
  }

  const stake = useCallback(
    async (initialize = true) => {
      if (!provider || !wallet) {
        toast('Please connect your wallet', { type: 'warning' })
        return
      }

      try {
        const tx = await bond({
          provider,
          user: wallet.publicKey,
          solrMint: SOLR_MINT_ADDRESS,
          garageTokenAccount: new PublicKey(tokenAccountAddress),
          garageMint: new PublicKey(mint),
          initialize,
        })
        const resp = await provider.connection.confirmTransaction(tx)
        if (resp.value.err) {
          toast('staked Failed', { type: 'error' })
        } else {
          toast('staked', { type: 'success' })
        }
        await revalidate()
      } catch (e) {
        toast('Stake Failed', { type: 'error' })
      }
    },
    [provider, wallet, tokenAccountAddress, mint],
  )

  const buttonContent = useMemo(() => {
    if (isStaked === undefined) {
      return 'isLoading'
    }

    if (isStaked) {
      return 'UNSTAKE'
    } else {
      return 'STAKE'
    }
  }, [isStaked])

  const pendingReward = useMemo(() => {
    if (!stakingAccountInfo || !poolAccountInfo) return undefined
    const { pendingReward, rewardIndex, isBond } = stakingAccountInfo
    const { globalRewardIndex } = poolAccountInfo

    let bondAmount = new anchor.BN(0)
    if (isBond) {
      bondAmount = new anchor.BN(1)
    }

    const a = globalRewardIndex.mul(bondAmount)
    const b = rewardIndex.mul(bondAmount)
    return toEther(pendingReward.add(a.sub(b)), 6).toNumber()
  }, [stakingAccountInfo, poolAccountInfo])

  return (
    <Card>
      <h3>{data.name}</h3>
      {imageURI ? (
        <Image
          src={imageURI}
          height="20vh"
          style={{
            borderRadius: '1rem',
          }}
        />
      ) : null}
      {pendingReward !== undefined && <p>reward: {pendingReward} SOLR </p>}
      <CTAButton disabled={!candyMachineID} onClick={stake}>
        {buttonContent}
      </CTAButton>
      <CTAButton disabled={!candyMachineID} onClick={verify}>
        VERIFY
      </CTAButton>
    </Card>
  )
}

export default StakingCard
