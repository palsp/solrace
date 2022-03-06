import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { PublicKey } from '@solana/web3.js'
import { useStaker } from '~/stake-nft/hooks'
import { NFTAccount } from '~/nft/hooks'
import { POOL_NAME } from '~/api/solana/constants'
import { upgradeKart } from '~/kart/services'
import { shortenIfAddress } from '~/wallet/utils'
import { useWorkspace } from '~/workspace/hooks'
import { useKartAccount } from '~/hooks/useAccount'
import { Column } from '~/ui'
import Button from '~/ui/Button'
import { PoolInfo } from '~/api/solana/account/pool-account'
import Image from '~/ui/Image'
import { usePool } from '~/pool/hooks'

const Card = styled(Column)`
  width: 20vw;
  height: 35em;
  align-items: space-between;
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 1rem;
`

const Select = styled.select`
  padding: 0.5rem;
  margin: 1rem;
  width: 100%;
  border-radius: 0.25rem;
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

const KartCard: React.FC<Props> = ({ nft }) => {
  const { mint: kartMint, tokenAccountAddress: kartTokenAccount } = nft
  const { stakers } = useStaker()
  const { provider } = useWorkspace()
  const { publicAddress: poolAccount } = usePool()

  const [selectedGarage, setSelectedGarage] = useState<PublicKey>()

  const {
    kartInfo,
    revalidate: revalidateKart,
    publicAddress,
    isInitialize,
    bump,
    isLoading,
  } = useKartAccount(POOL_NAME, kartMint)

  const handleGarageChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedGarage(new PublicKey(e.target.value))

  const handleUpgrade = async () => {
    // if (!solRaceProgram || !provider) return
    if (!selectedGarage) {
      toast('Please select the garage to enhance your kart', {
        type: 'warning',
      })
      return
    }
    if (isLoading || !poolAccount) {
      // not finish loading
      return
    }
    try {
      // we can ensure all ! field is exist by checking is loading
      const tx = await upgradeKart({
        provider,
        poolAccount,
        kartMint,
        kartAccount: publicAddress!,
        kartAccountBump: bump!,
        kartTokenAccount,
        stakingAccount: selectedGarage,
        isInitialize: isInitialize!,
      })
      const resp = await provider.connection.confirmTransaction(tx)
      if (resp.value.err) {
        toast('Fail! please try again', { type: 'error' })
      } else {
        toast('Upgrade succeed', { type: 'success' })
      }
      await revalidateKart()
    } catch (e) {
      console.log(e)
      toast('Fail! please try again', { type: 'error' })
    }
  }

  const disabled = useMemo(() => {
    return (
      bump === undefined ||
      !publicAddress ||
      isInitialize === undefined ||
      !selectedGarage
    )
  }, [bump, publicAddress, isInitialize, selectedGarage])

  return (
    <Card>
      <h3>Mint: {shortenIfAddress(nft.mint.toBase58())}</h3>
      <p>Max Speed: {kartInfo?.masSpeed || 0}</p>
      <Image
        src="/kart-template.png"
        height="25em"
        style={{
          borderRadius: '1rem',
        }}
      />
      {selectedGarage ? (
        <p>{shortenIfAddress(selectedGarage.toBase58())}</p>
      ) : (
        <p>SELECT GARAGE</p>
      )}
      <Select onChange={handleGarageChange}>
        {stakers.map((staker) => (
          <option
            key={staker.publicAddress.toBase58()}
            value={staker.publicAddress.toBase58()}
          >
            {shortenIfAddress(staker.publicAddress.toBase58())}
          </option>
        ))}
      </Select>
      <CTAButton onClick={handleUpgrade} disabled={disabled}>
        upgrade
      </CTAButton>
    </Card>
  )
}

export default KartCard
