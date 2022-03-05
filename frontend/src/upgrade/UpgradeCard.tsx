import { PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { SOL_RACE_STAKING_PROGRAM_ID } from '~/api/addresses'
import { useStaker } from '~/stake/hooks'
import { useKartAccount } from '~/upgrade/hooks'
import { upgradeKart } from '~/upgrade/services'
import { shortenIfAddress } from '~/wallet/utils'
import { useWorkspace } from '~/workspace/hooks'

interface Props {
  kartMint: PublicKey
  kartTokenAccount: PublicKey
}

const UpgradeCard: React.FC<Props> = ({ kartMint, kartTokenAccount }) => {
  const { stakerInfos } = useStaker()
  const { provider } = useWorkspace()

  const [selectedGarage, setSelectedGarage] = useState<PublicKey>(
    stakerInfos[0]?.publicAddress || undefined,
  )

  const {
    accountInfo,
    revalidate: revalidateKart,
    publicAddress,
    isInitialize,
    program: solRaceProgram,
    bump,
  } = useKartAccount(SOL_RACE_STAKING_PROGRAM_ID, kartMint)

  const handleUpgrade = async () => {
    if (!solRaceProgram || !provider) return

    if (!selectedGarage) {
      toast('Please select the garage to enhance your kart', {
        type: 'warning',
      })
      return
    }

    if (bump === undefined || !publicAddress || isInitialize === undefined) {
      return
    }

    try {
      const tx = await upgradeKart({
        program: solRaceProgram,
        provider,
        kartMint,
        kartAccount: publicAddress,
        kartAccountBump: bump,
        kartTokenAccount,
        stakingAccount: selectedGarage,
        isInitialize,
      })

      const resp = await provider.connection.confirmTransaction(tx)

      if (resp.value.err) {
        toast('Fail! please try again', { type: 'error' })
      } else {
        toast('Upgrade succeed', { type: 'success' })
      }
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
    <>
      <p>SELECT GARAGE</p>
      {selectedGarage && <p>{shortenIfAddress(selectedGarage.toBase58())}</p>}
      <select
        onChange={(e) => setSelectedGarage(new PublicKey(e.target.value))}
      >
        {stakerInfos.map((staker) => (
          <option key={staker.publicKey.toBase58()} value={staker.publicKey}>
            {shortenIfAddress(staker.publicKey.toBase58())}
          </option>
        ))}
      </select>
      <button onClick={handleUpgrade} disabled={disabled}>
        upgrade
      </button>
    </>
  )
}

export default UpgradeCard
