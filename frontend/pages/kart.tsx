import { useCallback, useMemo, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import AppLayout from '~/app/AppLayout'
import { useNFT } from '~/nft/hooks'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { BN } from '@project-serum/anchor'

import { useWorkspace } from '~/workspace/hooks'
import { getUserBalance, mint } from '~/mint/services'
import Title from '~/ui/Title'
import Button from '~/ui/Button'
import { Row } from '~/ui'
import KartCard from '~/kart/KartCard'
import ConnectWalletButton from '~/wallet/ConnectWalletButton'
import { usePool } from '~/pool/hooks'
import { KART_CM_ID } from '~/api/solana/addresses'
import { useCandyMachine } from '~/hooks/useCandyMachine'

import { KART_COLLECTION_NAME } from '~/kart/constants'
import { useAnchorWallet } from '~/wallet/hooks'
import ReactLoading from 'react-loading'

const Main = styled(Row)`
  justify-content: space-around;
  flex-wrap: wrap;
`

const KartPage = () => {
  const { provider } = useWorkspace()
  const anchorWallet = useAnchorWallet()
  const { connected } = useWallet()
  const { getNFTOfCollection, revalidateNFTs } = useNFT()
  const { poolInfo } = usePool()
  const [sufficientFund, setSufficientFund] = useState<boolean>(false)
  const [isPending, setIsPending] = useState(false)

  const nfts = useMemo(() => {
    return getNFTOfCollection(KART_COLLECTION_NAME)
  }, [getNFTOfCollection])

  const { candyMachine, revalidateCandyMachine } = useCandyMachine({
    candyMachineId: KART_CM_ID,
  })

  const validateUserBalance = useCallback(async () => {
    if (!anchorWallet || !candyMachine || !provider) {
      return
    }

    const [balance] = await getUserBalance(
      anchorWallet.publicKey,
      provider.connection,
      candyMachine.state.tokenMint,
    )

    setSufficientFund(new BN(balance).gte(candyMachine.state.price))
  }, [anchorWallet, provider, candyMachine])

  const handleMint = useCallback(async () => {
    if (!sufficientFund) {
      toast('Insufficient Balance', { type: 'error' })
      return
    }

    if (!provider || !candyMachine?.program) {
      toast('Please connect wallet', { type: 'warning' })
      return
    }

    try {
      setIsPending(true)
      const [mintTxId] = await mint({ provider, candyMachine })
      const resp = await provider.connection.confirmTransaction(mintTxId)
      if (resp.value.err) {
        toast('Mint Failed', { type: 'error' })
      } else {
        await Promise.all([revalidateNFTs(), revalidateCandyMachine()])
        toast('Congratulation! You have Minted new kart', { type: 'success' })
      }
    } catch (e) {
      toast('Mint Failed', { type: 'error' })
    } finally {
      setIsPending(false)
    }
  }, [
    sufficientFund,
    provider,
    candyMachine,
    revalidateCandyMachine,
    revalidateNFTs,
  ])

  useEffect(() => {
    validateUserBalance()
  }, [validateUserBalance])

  const mintRenderer = useMemo(() => {
    return isPending ? (
      <ReactLoading type="bubbles" color="#512da8" />
    ) : (
      <Button onClick={handleMint}> MINT</Button>
    )
  }, [isPending, handleMint])

  return (
    <AppLayout>
      <Title>KART</Title>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <>
          {mintRenderer}

          {poolInfo && (
            <Main>
              {nfts.map((nft) => (
                <KartCard key={nft.tokenAccountAddress} nft={nft} />
              ))}
            </Main>
          )}
        </>
      )}
    </AppLayout>
  )
}

export default KartPage
