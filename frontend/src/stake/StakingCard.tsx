import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { api } from '~/api'
import { Column } from '~/ui'
import { shortenIfAddress } from '~/wallet/utils'
import Image from '~/ui/Image'
import Button from '~/ui/Button'
import { useWorkspace } from '~/workspace/hooks'
import { toast } from 'react-toastify'
import { verifyNFT } from '~/stake/services'
import { PublicKey } from '@solana/web3.js'

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
  candyMachineID?: string
}

const StakingCard: React.FC<Props> = ({ account, candyMachineID }) => {
  const { tokenAccountAddress, data, mint } = account
  const { provider, wallet } = useWorkspace()
  const { uri } = data
  const [imageURI, setImageURI] = useState<string>()

  const loadMetadata = async (targetUri: string) => {
    const { data: metadata } = await api.get(targetUri)

    setImageURI(metadata.image)
  }

  useEffect(() => {
    loadMetadata(uri)
  }, [uri])

  const stake = useCallback(async () => {
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
        wallet,
        nftMint: new PublicKey(mint),
        creator: new PublicKey(candyMachineID),
        nftTokenAccount: tokenAccountAddress,
      })
      const resp = await provider.connection.confirmTransaction(tx)
      if (resp.value.err) {
        toast('Verification Failed', { type: 'error' })
      } else {
        toast('Your NFT is verified', { type: 'success' })
      }
    } catch (e) {
      toast('Verification Failed', { type: 'error' })
    }
  }, [provider, wallet, candyMachineID, mint, tokenAccountAddress])

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
      <CTAButton disabled={!candyMachineID} onClick={stake}>
        STAKE
      </CTAButton>
    </Card>
  )
}

export default StakingCard
