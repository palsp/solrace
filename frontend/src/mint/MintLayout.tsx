import { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as anchor from '@project-serum/anchor'

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
import { CANDY_MACHINE_PROGRAM } from '~/api/solana/addresses'
import { getUserBalance, handleMintError } from '~/mint/services'
import MintCard from '~/mint/MintCard'
import { mint } from '~/garage/services'
import { toastAPIError } from '~/utils'

const MintContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
` // add your owns styles here

const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
  ? new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID)
  : undefined

const MintLayout = () => {
  const wallet = useWallet()
  const { provider } = useWorkspace()
  const { connection } = useConnection()
  const [isUserMinting, setIsUserMinting] = useState(false)
  const [userBalance, setUserBalance] = useState<anchor.BN>()
  const [isValidMint, setIsValidMint] = useState<boolean>(false)

  const anchorWallet = useAnchorWallet()

  const { revalidate, ...attributes } = useCandyMachine({
    candyMachineId,
  })

  const {
    candyMachine,
    discountPrice,
    isWhitelistUser,
    endDate,
    itemsRemaining,
    isPresale,
    isActive,
  } = attributes

  useEffect(() => {
    if (anchorWallet && candyMachine) {
      getUserBalance(
        anchorWallet.publicKey,
        connection,
        candyMachine?.state.tokenMint,
      ).then(([balance]) => {
        const valid = new anchor.BN(balance).gte(candyMachine.state.price)
        setIsValidMint(valid)
      })
    }
  }, [anchorWallet, connection, candyMachine])

  const handleMint = async () => {
    if (!isValidMint) {
      toast('Insufficient Balance', { type: 'error' })
      return
    }
    try {
      setIsUserMinting(true)

      if (
        !wallet.connected ||
        !candyMachine?.program ||
        !wallet.publicKey ||
        !provider
      ) {
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
        await revalidate()
        toast('Congratulation! You have Minted new garage.', {
          type: 'success',
        })
      }
    } catch (e) {
      console.log(e)
      const message = handleMintError(e)
      toast(message, { type: 'error' })
    } finally {
      setIsUserMinting(false)
    }
  }

  return (
    <MintContainer>
      {candyMachine && <MintCard {...attributes} candyMachine={candyMachine} />}
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
