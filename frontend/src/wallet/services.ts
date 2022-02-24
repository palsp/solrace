import { WalletContextState } from '@solana/wallet-adapter-react'
import { api } from '~/api'

export const getMessage = (
  nonce: string,
) => `Hello! Sign this message to prove your ownership of this wallet so we can proceed with your action. This won't cost you any SOL.

To prevent hackers from using this wallet, here's a unique message ID they can't guess: ${nonce}.`

export async function requestNonce(publicAddress?: string) {
  const { data } = await api.get(
    publicAddress ? `/wallet/nonce/${publicAddress}` : `wallet/nonce`,
  )
  return data
}

export async function verifySignature(
  publicAddress: string,
  signature: number[],
) {
  const { data } = await api.post('/wallet/verify-signature', {
    publicAddress,
    signature,
  })
  return data
}

export async function signWallet(
  wallet: WalletContextState,
  nonce: string,
): Promise<{ signature: number[]; publicAddress: string }> {
  const msgUint8 = new TextEncoder().encode(getMessage(nonce))

  if (!wallet.signMessage) {
    throw new Error('Unsupported Wallet')
  }

  if (!wallet.publicKey) {
    throw new Error('Undetected public key')
  }

  const signature = await wallet.signMessage(msgUint8)

  return {
    publicAddress: wallet.publicKey.toBase58(),
    signature: Array.from(signature),
  }
}

export async function linkWallet(wallet: WalletContextState) {
  const { nonce } = await requestNonce()
  const { publicAddress, signature } = await signWallet(wallet, nonce)

  await api.post('/wallet/sync', {
    publicAddress,
    signature,
  })

  return publicAddress
}

export async function deleteWallet(wallet: WalletContextState) {
  const { nonce } = await requestNonce()
  const { signature } = await signWallet(wallet, nonce)

  await api.post('/wallet/un-sync', {
    signature,
  })
}
