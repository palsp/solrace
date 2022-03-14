import { useCallback, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from '~/app/AppLayout'
import { useWorkspace } from '~/workspace/hooks'
import ReactLoading from 'react-loading'
import { useNFT } from '~/nft/hooks'
import GarageCard from '~/garage/GarageCard'
import Button from '~/ui/Button'
import Title from '~/ui/Title'
import { Row } from '~/ui'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectWalletButton from '~/wallet/ConnectWalletButton'
import { BN } from '@project-serum/anchor'
import { usePool } from '~/pool/hooks'
import { useCandyMachine } from '~/hooks/useCandyMachine'
import { GARAGE_CM_ID, GARAGE_CREATOR } from '~/api/solana/addresses'
import { useAnchorWallet } from '~/wallet/hooks'
import { getUserBalance, handleMintError, mint } from '~/mint/services'
import { toast } from 'react-toastify'
import { toastAPIError } from '~/utils'
import { GARAGE_COLLECTION_NAME } from '~/garage/constants'
import { PublicKey } from '@solana/web3.js'

const Main = styled(Row)`
  justify-content: space-around;
  flex-wrap: wrap;
`

const CTAButton = styled(Button)`
  margin-bottom: 1rem;
`

const GaragePage = () => {
  const { provider } = useWorkspace()
  const anchorWallet = useAnchorWallet()
  const { poolInfo, apr } = usePool()
  const { connected } = useWallet()
  const { getNFTOfCollection, revalidateNFTs } = useNFT()
  const [sufficientFund, setSufficientFund] = useState<boolean>(false)
  const [isPending, setIsPending] = useState(false)

  const { candyMachine, revalidateCandyMachine } = useCandyMachine({
    candyMachineId: GARAGE_CM_ID,
  })

  const nfts = useMemo(() => {
    return getNFTOfCollection(GARAGE_COLLECTION_NAME)
  }, [getNFTOfCollection])

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

    try {
      setIsPending(true)
      if (!provider || !candyMachine?.program) {
        toast('Please connect wallet', { type: 'warning' })
        return
      }

      const [mintTxId] = await mint({
        provider,
        candyMachine,
      })
      const resp = await provider.connection.confirmTransaction(mintTxId)
      if (resp.value.err) {
        toastAPIError(resp.value.err, 'Mint Failed')
      } else {
        await Promise.all([revalidateCandyMachine(), revalidateNFTs()])
        toast('Congratulation! You have Minted new garage.', {
          type: 'success',
        })
      }
    } catch (e) {
      const message = handleMintError(e)
      toast(message, { type: 'error' })
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
      <CTAButton onClick={handleMint} disabled={isPending}>
        MINT
      </CTAButton>
    )
  }, [isPending, handleMint])

  return (
    <AppLayout>
      <Title>GARAGE</Title>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <>
          <h1>APR: {apr} % </h1>

          {mintRenderer}
          {poolInfo && (
            <Main>
              {nfts.map((nft) => (
                <GarageCard key={nft.tokenAccountAddress} nft={nft} />
              ))}
            </Main>
          )}
        </>
      )}
    </AppLayout>
  )
}

export default GaragePage
