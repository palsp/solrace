import AppLayout from '~/app/AppLayout'

import { useWorkspace } from '~/workspace/hooks'
import { useNFT, usePoolAccount } from '~/gov/hooks'

import CollectionCard from '~/stake/CollectionCard'
import Title from '~/ui/Title'
import { Column, Row } from '~/ui'
import styled from 'styled-components'
import { stake } from '~/gov/services'
import { toast } from 'react-toastify'
import StakeGovCard from '~/gov/StakeGovCard'
import { POOL_NAME } from '~/gov/hooks'
import { SOL_RACE_STAKING_GOV_PROGRAM_ID } from '~/api/addresses'
import { useStaker } from '~/stake/hooks'

const StakeArea = styled(Row)`
  justify-content: space-around;
`

const GovPage = () => {
  const { provider, wallet } = useWorkspace()
  const { nfts, revalidate: revalidateNFTs } = useNFT(wallet?.publicKey)
  const { stakerInfos } = useStaker()
  const { poolInfo, revalidate } = usePoolAccount(
    SOL_RACE_STAKING_GOV_PROGRAM_ID,
    POOL_NAME,
  )

  const handleStake = async () => {
    if (!provider || !wallet) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    try {
      const tx = await stake(wallet.publicKey, provider)
      const resp = await provider.connection.confirmTransaction(tx)
      if (resp.value.err) {
        toast('Stake Failed', { type: 'error' })
      } else {
        toast('Stake Succeed', { type: 'success' })
      }
      await revalidateNFTs()
    } catch (e) {
      console.log(e)
      toast('Stake Failed', { type: 'error' })
    }
  }

  return (
    <AppLayout>
      <Title>STAKE</Title>
      <button onClick={handleStake}>new</button>
      <StakeArea>
        {nfts.map((nft) => (
          <StakeGovCard
            key={nft.tokenAccountAddress.toBase58()}
            nft={nft}
            revalidatePool={revalidate}
            poolInfo={poolInfo}
          />
        ))}
      </StakeArea>
    </AppLayout>
  )
}

export default GovPage
