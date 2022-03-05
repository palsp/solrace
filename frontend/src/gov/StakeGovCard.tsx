import { useMemo } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { SOLR_MINT_ADDRESS, SOL_RACE_STAKING_PROGRAM_ID } from '~/api/addresses'
import { NFTAccount, useStakeAccount } from '~/gov/hooks'
import { bond } from '~/gov/services'
import { Column } from '~/ui'
import Button from '~/ui/Button'
import { shortenIfAddress } from '~/wallet/utils'
import { useWorkspace } from '~/workspace/hooks'

const Card = styled(Column)`
  width: 20vw;
  height: 40vh;
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
  revalidatePool: () => Promise<void>
  poolAccountInfo: any
}
const StakeGovCard: React.FC<Props> = ({
  nft,
  revalidatePool,
  poolAccountInfo,
}) => {
  const { mint, tokenAccountAddress } = nft
  const {
    stakingAccountInfo,
    isStaked,
    revalidate: revalidateStakeAccount,
  } = useStakeAccount(SOL_RACE_STAKING_PROGRAM_ID, nft.tokenAccountAddress)

  const { provider, wallet } = useWorkspace()

  const handleStake = async () => {
    if (!provider || !wallet) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    try {
      const tx = await bond({
        provider,
        user: wallet.publicKey,
        nftMint: mint,
        solrMint: SOLR_MINT_ADDRESS,
        nftTokenAccount: tokenAccountAddress,
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
  }

  const buttonContent = useMemo(() => {
    if (isStaked === undefined) return '...'

    if (isStaked) {
      return 'UNSTAKE'
    } else {
      return 'STAKE'
    }
  }, [isStaked])
  const { globalRewardIndex } = poolAccountInfo
  const { pendingReward, rewardIndex, isBond } = stakingAccountInfo

  const displayReward = useMemo(() => {
    if (
      globalRewardIndex === undefined ||
      !pendingReward ||
      rewardIndex === undefined ||
      isBond === undefined
    ) {
      return undefined
    }

    const bondAmount = isBond ? 1 : 0
    return (
      pendingReward.toNumber() +
      (globalRewardIndex * bondAmount - rewardIndex * bondAmount) / 10 ** 6
    ).toFixed(2)
  }, [globalRewardIndex, pendingReward, rewardIndex, isBond])

  return (
    <Card>
      <h3>Mint: {shortenIfAddress(nft.mint.toBase58())}</h3>
      <p>ata: {shortenIfAddress(nft.tokenAccountAddress.toBase58())}</p>
      {displayReward !== undefined && <p>reward: {displayReward} SOLR </p>}
      <CTAButton onClick={handleStake}>{buttonContent}</CTAButton>
    </Card>
  )
}

export default StakeGovCard
