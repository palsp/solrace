import { useState } from 'react'
import styled from 'styled-components'

import { GatewayProvider } from '@civic/solana-gateway-react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useAnchorWallet } from '~/wallet/hooks'
import {
  awaitTransactionSignatureConfirmation,
  mintOneToken,
} from '~/api/solana/candy-machine'
import { useCandyMachine } from '~/hooks/useCandyMachine'
import { PublicKey } from '@solana/web3.js'
import MintButton from '~/mint/MintButton'
import { DEFAULT_ENDPOINT } from '~/workspace/constants'
import { toast } from 'react-toastify'
import { useWorkspace } from '~/workspace/hooks'
import { CANDY_MACHINE_PROGRAM } from '~/contract/addresses'

const MintContainer = styled.div`` // add your owns styles here

const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
  ? new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID)
  : undefined

const MintLayout = () => {
  const wallet = useWallet()
  const { provider } = useWorkspace()
  const { connection } = useConnection()
  const [isUserMinting, setIsUserMinting] = useState(false)

  const anchorWallet = useAnchorWallet()
  const {
    candyMachine,
    discountPrice,
    isWhitelistUser,
    endDate,
    itemsRemaining,
    isPresale,

    isActive,
  } = useCandyMachine({
    candyMachineId,
  })

  const handleMint = async () => {
    try {
      setIsUserMinting(true)
      if (!wallet.connected || !candyMachine?.program || !wallet.publicKey) {
        toast('Please connect wallet', { type: 'warning' })
        return
      }

      const [mintTxId] = await mintOneToken(candyMachine, wallet.publicKey)
      let status: any = { err: true }
      if (mintTxId) {
        status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          30000,
          connection,
          true,
        )
      }

      if (status && !status.err) {
        // TODO: update candy machine state
        toast('Congratulations! Mint succeeded!', { type: 'success' })
      } else {
        console.log(status)
        toast('Mint failed! Please try again!', { type: 'error' })
      }
    } catch (e) {
      console.log(e)
      toast('Mint Failed!, please try again')
    } finally {
      setIsUserMinting(false)
    }
  }

  return (
    <MintContainer>
      {wallet.signTransaction ? (
        <GatewayProvider
          wallet={{
            publicKey: wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
            //@ts-ignore
            signTransaction: wallet.signTransaction,
          }}
          gatekeeperNetwork={candyMachine?.state?.gatekeeper?.gatekeeperNetwork}
          clusterUrl={DEFAULT_ENDPOINT.url}
          options={{ autoShowModal: false }}
        >
          <MintButton
            candyMachine={candyMachine}
            isMinting={isUserMinting}
            onMint={handleMint}
            isActive={isActive || (isPresale && isWhitelistUser)}
          />
        </GatewayProvider>
      ) : (
        <MintButton
          candyMachine={candyMachine}
          isMinting={isUserMinting}
          onMint={handleMint}
          isActive={isActive || (isPresale && isWhitelistUser)}
        />
      )}
    </MintContainer>
  )
}

export default MintLayout
