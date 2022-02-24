import { utils } from '@project-serum/anchor'
import * as anchor from '@project-serum/anchor'
import { Message } from '@solana/web3.js'

import * as bip32 from 'bip32'
import nacl from 'tweetnacl'
import { TextEncoder } from 'util'

import bs58 from 'bs58'
import { UserNonce } from 'entity/UserNonce'
import { User } from 'entity/User'
import { badRequest, conflict, unauthorized } from '@hapi/boom'
import { Wallet } from 'entity/Wallet'
import { PostgresError } from 'pg-error-enum'

export const getMessage = (
  nonce: string,
) => `Hello! Sign this message to prove your ownership of this wallet so we can proceed with your action. This won't cost you any SOL.

To prevent hackers from using this wallet, here's a unique message ID they can't guess: ${nonce}.`

export async function getOrCreateUserNonce(user: User) {
  const userNonce = await UserNonce.findOne({ user })
  if (userNonce) {
    return userNonce
  }

  return UserNonce.create({ user }).save()
}

export const verifySignature = async (
  publicAddress: string,
  userNonce: UserNonce,
  signature: number[],
) => {
  const signatureUint8 = Uint8Array.from(signature)
  const msgUint8 = new TextEncoder().encode(getMessage(userNonce.nonce))
  const pubkeyUint8 = bs58.decode(publicAddress)

  const isVerified = nacl.sign.detached.verify(
    msgUint8,
    signatureUint8,
    pubkeyUint8,
  )
  if (!isVerified) {
    throw unauthorized('Signature verification failed')
  }

  await UserNonce.refresh(userNonce)
}

export async function getWallet(user: User) {
  const wallet = await Wallet.findOne({ user })
  return wallet
}

export async function addWallet(
  user: User,
  publicAddress: string,
  signature: number[],
) {
  const userNonce = await getOrCreateUserNonce(user)
  await verifySignature(publicAddress, userNonce, signature)

  const wallet = await Wallet.findOne({ user })

  if (wallet) {
    throw badRequest('User already has the wallet')
  }

  try {
    const newWallet = await Wallet.create({ user, publicAddress }).save()
    return newWallet
  } catch (e) {
    if ((e as any).code === PostgresError.UNIQUE_VIOLATION) {
      throw conflict('Wallet is already in use by another user')
    }
    throw e
  }
}

export async function deleteWallet(user: User, signature: number[]) {
  const wallet = await Wallet.findOne({ user })

  if (!wallet) {
    throw badRequest('Wallet does not exist')
  }

  const { publicAddress } = wallet
  const userNonce = await getOrCreateUserNonce(user)

  await verifySignature(publicAddress, userNonce, signature)

  return Wallet.delete({ user })
}
