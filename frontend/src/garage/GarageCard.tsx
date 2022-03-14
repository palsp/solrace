import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import ReactLoading from 'react-loading'
import { useWorkspace } from '~/workspace/hooks'
import { useStakeAccount } from '~/hooks/useAccount'
import { shortenIfAddress } from '~/wallet/utils'
import { bond, unBond } from '~/garage/services'
import { SOLR_MINT_ADDRESS } from '~/api/solana/addresses'
import { Row } from '~/ui'
import Button from '~/ui/Button'
import Image from '~/ui/Image'
import { NFTAccount, NFTAccountData } from '~/nft/hooks'
import { POOL_NAME } from '~/api/solana/constants'
import { usePool } from '~/pool/hooks'
import { useStaker } from '~/staker/hooks'
import { toastAPIError } from '~/utils'
import Card from '~/ui/Card'
import { calculateReward } from '~/pool/utils'
import { useMintInfo } from '~/hooks/useMintInfo'
import CircularProgress from '~/ui/CircularProgress'
import { useCountdown } from '~/hooks/useCountdown'
import { PublicKey } from '@solana/web3.js'
import { verifyNFT } from '~/mint/services'

const CTAButton = styled(Button)`
  border: 1px solid #ccc;
  border-radius: 1rem;
  margin: 1rem;

  &:hover {
    background-color: #1a1f2e;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #ccc;
  }
`

const MainCard = styled(Card)`
  position: relative;
`

const ProgressSection = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  justify-content: space-evenly;
`
interface Props {
  nft: NFTAccountData
}

const AUTO_REFRESH_TIME = 10 * 1000

const GarageCard: React.FC<Props> = ({ nft }) => {
  const { mint, tokenAccountAddress } = nft

  const { provider, wallet } = useWorkspace()
  const {
    poolInfo,
    revalidate: revalidatePool,
    publicAddress: poolAccount,
  } = usePool()
  const mintInfo = useMintInfo(poolInfo?.solrMint)
  const mintPubkey = useMemo(() => new PublicKey(mint), [mint])
  const tokenAccount = useMemo(() => new PublicKey(tokenAccountAddress), [
    tokenAccountAddress,
  ])

  const {
    stakeInfo,
    isStaked,
    isInitialize,
    isLoading: loadingStaker,
    publicAddress: stakingAccount,
    bump: stakingAccountBump,
    revalidate: revalidateStakeAccount,
  } = useStakeAccount(POOL_NAME, mintPubkey)
  const { revalidate: revalidateStaker } = useStaker()
  const [loading, setLoading] = useState(false)
  const [reward, setReward] = useState<string>()
  // const [countdown, setCountdown] = useState(AUTO_REFRESH_TIME)

  const calcReward = useCallback(() => {
    if (poolInfo && stakeInfo && mintInfo) {
      setReward(
        calculateReward(stakeInfo, poolInfo, mintInfo.decimals).toFixed(2),
      )
    }
  }, [poolInfo, stakeInfo, mintInfo])

  const { countdown, resetCountdown } = useCountdown(calcReward)

  const toggleStake = async () => {
    if (!provider || !wallet) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    if (!poolAccount || loadingStaker) {
      return
    }

    setLoading(true)
    if (!isStaked) {
      try {
        const tx = await bond({
          provider,
          user: wallet.publicKey,
          poolAccount,
          solrMint: SOLR_MINT_ADDRESS,
          nftMint: mintPubkey,
          nftTokenAccount: tokenAccount,
          stakingAccount: stakingAccount!,
          stakingAccountBump: stakingAccountBump!,
          isInitialized: isInitialize!,
        })

        const resp = await provider.connection.confirmTransaction(tx)
        if (resp.value.err) {
          toastAPIError(resp.value.err, 'Stake Failed')
        } else {
          toast('Congratulation! You have staked your garage.', {
            type: 'success',
          })
          await Promise.all([revalidatePool(), revalidateStakeAccount()])
        }
      } catch (e) {
        toastAPIError(e as any, 'Stake Failed')
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
          toastAPIError(resp.value.err, 'UnStake Failed')
        } else {
          toast('You have unstaked your garage.', {
            type: 'success',
          })
          await Promise.all([
            revalidatePool(),
            revalidateStakeAccount(),
            revalidateStaker(),
          ])
        }
      } catch (e) {
        toastAPIError(e as any, 'UnStake Failed')
      }
    }
    setLoading(false)
    resetCountdown()
  }

  // const handleVerify = async () => {
  //   try {
  //     await verifyNFT({
  //       provider,
  //       nftMint: mintPubkey,
  //       nftTokenAccount: tokenAccount,
  //     })
  //     toast('Your Garage is Verified', { type: 'success' })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // calculate for the first time all data is loaded from blockchain
  useEffect(() => {
    calcReward()
  }, [calcReward])

  const buttonContent = useMemo(() => {
    if (isStaked === undefined) return '...'

    if (isStaked) {
      return 'UNSTAKE'
    } else {
      return 'STAKE'
    }
  }, [isStaked])

  const rewardRenderer = useMemo(() => {
    return reward !== undefined ? <p>reward: {reward} SOLR </p> : null
  }, [reward])

  return (
    <MainCard>
      <h3>{nft.data.name}</h3>
      <ProgressSection>
        {stakeInfo?.isBond && (
          <CircularProgress
            value={!loading ? (100 / AUTO_REFRESH_TIME) * countdown : 100}
            width="20px"
            height="20px"
          />
        )}
      </ProgressSection>
      {rewardRenderer}
      <Image
        src="/garage-template.jpeg"
        height="25em"
        style={{
          borderRadius: '1rem',
        }}
      />
      {loading || loadingStaker ? (
        <ReactLoading type="bubbles" color="#512da8" />
      ) : (
        <CTAButton onClick={toggleStake} disabled={loadingStaker || loading}>
          {buttonContent}
        </CTAButton>
      )}
      {/* <CTAButton onClick={handleVerify}>Verify</CTAButton> */}
    </MainCard>
  )
}

export default GarageCard
