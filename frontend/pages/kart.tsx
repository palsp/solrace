import { toast } from 'react-toastify'
import AppLayout from '~/app/AppLayout'
import { useAllNFT } from '~/nft/hooks'
import { POOL_NAME } from '~/api/solana/constants'
import styled from 'styled-components'

import { useWorkspace } from '~/workspace/hooks'
import { mint } from '~/mint/services'
import Title from '~/ui/Title'
import Button from '~/ui/Button'
import { Row } from '~/ui'
import { usePoolAccount } from '~/hooks/useAccount'
import KartCard from '~/kart/KartCard'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectWalletButton from '~/wallet/ConnectWalletButton'
import { usePool } from '~/pool/hooks'

const Main = styled(Row)`
  justify-content: space-around;
`

const KartPage = () => {
  const { provider, wallet } = useWorkspace()
  const { connected } = useWallet()
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey)
  const { poolInfo } = usePool()

  const handleMint = async () => {
    if (!provider || !wallet) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    try {
      const tx = await mint(wallet.publicKey, provider)
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
      <Title>KART</Title>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <>
          <Button onClick={handleMint}>MOCK MINT</Button>
          {poolInfo && (
            <Main>
              {nfts.map((nft) => (
                <KartCard key={nft.tokenAccountAddress.toBase58()} nft={nft} />
              ))}
            </Main>
          )}
        </>
      )}
    </AppLayout>
  )
}

export default KartPage
