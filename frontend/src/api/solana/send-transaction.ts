import {
  Keypair,
  Commitment,
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  Blockhash,
  FeeCalculator,
} from '@solana/web3.js'

import { WalletNotConnectedError } from '@solana/wallet-adapter-base'

export const getErrorForTransaction = async (
  connection: Connection,
  txid: string,
) => {
  // wait for all confirmation before geting transaction
  await connection.confirmTransaction(txid, 'max')

  const tx = await connection.getParsedConfirmedTransaction(txid)

  const errors: string[] = []
  if (tx?.meta && tx.meta.logMessages) {
    tx.meta.logMessages.forEach((log) => {
      const regex = /Error: (.*)/gm
      let m
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        if (m.length > 1) {
          errors.push(m[1])
        }
      }
    })
  }

  return errors
}

export enum SequenceType {
  Sequential,
  Parallel,
  StopOnFailure,
}

export const sendTransactions = async (
  connection: Connection,
  wallet: any,
  instructionSet: TransactionInstruction[][],
  signersSet: Keypair[][],
  commitment: Commitment = 'singleGossip',
): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  const unsignedTxns: Transaction[] = []

  for (let i = 0; i < instructionSet.length; i++) {
    const instructions = instructionSet[i]
    const signers = signersSet[i]

    if (instructions.length === 0) {
      continue
    }

    let transaction = new Transaction({ feePayer: wallet.publicKey })
    instructions.forEach((instruction) => transaction.add(instruction))

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash(commitment)
    ).blockhash

    if (signers.length > 0) transaction.partialSign(...signers)

    unsignedTxns.push(transaction)
  }

  const signedTxns = await wallet.signAllTransactions(unsignedTxns)

  const pendingTxns: Promise<{ txid: string; slot: number }>[] = []

  for (let i = 0; i < signedTxns.length; i++) {
    const signedTxnPromise = sendSignedTransaction({
      connection,
      signedTransaction: signedTxns[i],
    })

    pendingTxns.push(signedTxnPromise)
  }

  return { number: signedTxns.length, txs: await Promise.all(pendingTxns) }
}

export const getUnixTs = () => {
  return new Date().getTime() / 1000
}

const DEFAULT_TIMEOUT = 600000

export async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction
  connection: Connection
  sendingMessage?: string
  sentMessage?: string
  successMessage?: string
  timeout?: number
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize()
  const startTime = getUnixTs()
  let slot = 0
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    },
  )

  let done = false
  ;(async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      })
      await sleep(500)
    }
  })()

  try {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection,
      'recent',
      true,
    )

    if (!confirmation)
      throw new Error('Timed out awaiting confirmation on transaction')

    if (confirmation.err) {
      console.error(confirmation.err)
      throw new Error('Transaction failed: Custom instruction error')
    }

    slot = confirmation?.slot || 0
  } catch (err) {
    console.error('Timeout Error caught', err)
    if ((err as any).timeout) {
      throw new Error('Timed out awaiting confirmation on transaction')
    }
    let simulateResult: SimulatedTransactionResponse | null = null
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value
    } catch (e) {}
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i]
          if (line.startsWith('Program log: ')) {
            throw new Error(
              'Transaction failed: ' + line.slice('Program log: '.length),
            )
          }
        }
      }
      throw new Error(JSON.stringify(simulateResult.err))
    }
    // throw new Error('Transaction failed');
  } finally {
    done = true
  }

  return { txid, slot }
}

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment,
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching,
  )

  const signData = transaction.serializeMessage()
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData)
  const encodedTransaction = wireTransaction.toString('base64')
  const config: any = { encoding: 'base64', commitment }
  const args = [encodedTransaction, config]

  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args)
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message)
  }
  return res.result
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = 'recent',
  queryStatus = false,
): Promise<SignatureStatus | null | void> {
  let done = false
  let status: SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  }
  let subId = 0
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return
      }
      done = true
      reject({ timeout: true })
    }, timeout)
    try {
      subId = connection.onSignature(
        txid,
        (result, context) => {
          done = true
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0,
          }
          if (result.err) {
            reject(status)
          } else {
            resolve(status)
          }
        },
        commitment,
      )
    } catch (e) {
      done = true
    }
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      ;(async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ])
          status = signatureStatuses && signatureStatuses.value[0]
          if (!done) {
            if (!status) {
              return
            } else if (status.err) {
              done = true
              reject(status.err)
            } else if (!status.confirmations) {
              return
            } else {
              done = true
              resolve(status)
            }
          }
        } catch (e) {}
      })()
      await sleep(2000)
    }
  })

  //@ts-ignore
  if (connection._signatureSubscriptions[subId])
    connection.removeSignatureListener(subId)
  done = true
  return status
}
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
