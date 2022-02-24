import { Provider, Wallet } from '@project-serum/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { api } from '~/api'
import { WorkSpace } from '~/workspace/WorkspaceContext'

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
  signature: Uint8Array,
) {
  const { data } = await api.post('/wallet/verify-signature', {
    publicAddress,
    signature,
  })
  return data
}

export async function signWallet(
  { wallet }: WorkSpace,
  nonce: string,
): Promise<{ signature?: Uint8Array; publicAddress?: string }> {
  const msgUint8 = new TextEncoder().encode(getMessage(nonce))

  if (!wallet) {
    return {}
  }

  let signature
  if (wallet.signMessage) {
    signature = await wallet.signMessage(msgUint8)
    console.log(msgUint8)
    // console.log(signature)
  }

  return {
    publicAddress: wallet.publicKey?.toBase58(),
    signature,
  }
}
