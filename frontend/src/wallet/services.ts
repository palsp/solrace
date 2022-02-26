import { WalletContextState } from '@solana/wallet-adapter-react'
import { api } from '~/api'

export async function requestSigningMessage() {
  const { data } = await api.get(`wallet/message`)
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
  message: string,
): Promise<{ signature: number[]; publicAddress: string }> {
  const msgUint8 = new TextEncoder().encode(message)

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
  const { message } = await requestSigningMessage()
  const { publicAddress, signature } = await signWallet(wallet, message)

  await api.post('/wallet/sync', {
    publicAddress,
    signature,
  })

  return publicAddress
}

export async function deleteWallet(wallet: WalletContextState) {
  const { message } = await requestSigningMessage()
  const { signature } = await signWallet(wallet, message)

  await api.post('/wallet/un-sync', {
    signature,
  })
}
