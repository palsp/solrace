import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import AppLayout from '~/app/AppLayout'
import { useAuth, useRequireAuth } from '~/auth/hooks'
import { Column } from '~/ui'
import { useLinkedWallet } from '~/wallet/hooks'
import { useWorkspace } from '~/workspace/hooks'
import {
  deleteWallet,
  linkWallet,
  requestNonce,
  signWallet,
  verifySignature,
} from '~/wallet/services'
import { shortenIfAddress } from '~/wallet/utils'
import { toastAPIError } from '~/utils'

const AccountContainer = styled(Column)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
`

const AccountPage = () => {
  useRequireAuth()

  const workspace = useWorkspace()

  const { wallet } = workspace
  const { publicAddress, revalidate } = useLinkedWallet()
  const { push } = useRouter()

  const { user, logout } = useAuth()

  const toggle = async () => {
    if (!user) {
      push('/login')
      return
    }

    if (!wallet || !wallet.publicKey) {
      toast('Please Connect Wallet', {
        type: 'warning',
      })
      return
    }

    if (!publicAddress) {
      try {
        await linkWallet(wallet)
        await revalidate()
        toast('Connect wallet success', {
          type: 'success',
        })
      } catch (e) {
        toastAPIError(e as any)
      }
    } else {
      if (
        wallet.publicKey.toBase58().toLowerCase() !==
        publicAddress.toLowerCase()
      ) {
        toast(
          'The current connected wallet address does not match your linked wallet, please switch to the linked wallet',
          {
            type: 'warning',
          },
        )
        return
      }
      try {
        await deleteWallet(wallet)
        await revalidate()
        toast('Your wallet has been disconnect', { type: 'success' })
      } catch (e) {
        toastAPIError(e as any)
      }
    }
  }

  const verify = async () => {
    if (!wallet || !wallet.publicKey) {
      toast('Please Connect Wallet', {
        type: 'warning',
      })
      return
    }
    const { nonce } = await requestNonce()
    const { signature, publicAddress } = await signWallet(wallet, nonce)
    try {
      await verifySignature(publicAddress, signature)
      toast('Signature Verified', {
        type: 'success',
      })
    } catch (e) {
      toastAPIError(e as any)
    }
  }

  useEffect(() => {
    if (user) {
      revalidate()
    }
  }, [user])

  const getButtonContent = () => {
    if (!user) {
      return 'Connect Wallet'
    }
    // wallet not found
    if (publicAddress === null) {
      return 'Connect Your Wallet'
    }

    return `Disconnect ${shortenIfAddress(publicAddress)}`
  }

  return (
    <AppLayout>
      <AccountContainer>
        <button onClick={logout}>logout</button>
        <button type="button" style={{ width: '20%' }} onClick={toggle}>
          {getButtonContent()}
        </button>

        <button onClick={verify}>verify</button>
      </AccountContainer>
    </AppLayout>
  )
}

export default AccountPage
