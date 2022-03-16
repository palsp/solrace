import * as anchor from '@project-serum/anchor'
import {
  CANDY_MACHINE_PROGRAM,
  TOKEN_METADATA_PROGRAM_ID,
} from '~/api/solana/addresses'

interface CandyMachineState {
  itemsAvailable: number
  itemsRedeemed: number
  itemsRemaining: number
  treasury: anchor.web3.PublicKey
  tokenMint: anchor.web3.PublicKey
  isSoldOut: boolean
  isActive: boolean
  isPresale: boolean
  isWhitelistOnly: boolean
  goLiveDate: anchor.BN
  price: anchor.BN
  gatekeeper: null | {
    expireOnUse: boolean
    gatekeeperNetwork: anchor.web3.PublicKey
  }
  endSettings: null | {
    number: anchor.BN
    endSettingType: any
  }
  whitelistMintSettings: null | {
    mode: any
    mint: anchor.web3.PublicKey
    presale: boolean
    discountPrice: null | anchor.BN
  }
  hiddenSettings: null | {
    name: string
    uri: string
    hash: Uint8Array
  }
}

export interface CandyMachineAccount {
  id: anchor.web3.PublicKey
  program: anchor.Program
  state: CandyMachineState
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  queryStatus = false,
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false
  let status: anchor.web3.SignatureStatus | null | void = {
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
  if (connection._signatureSubscriptions[subId]) {
    connection.removeSignatureListener(subId)
  }
  done = true

  return status
}

export const getCandyMachineState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection,
): Promise<CandyMachineAccount> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: 'processed',
  })

  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider)

  const program = new anchor.Program(idl!, CANDY_MACHINE_PROGRAM, provider)

  const state: any = await program.account.candyMachine.fetch(candyMachineId)

  const itemsAvailable = state.data.itemsAvailable.toNumber()
  const itemsRedeemed = state.itemsRedeemed.toNumber()
  const itemsRemaining = itemsAvailable - itemsRedeemed

  return {
    id: candyMachineId,
    program,
    state: {
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive: false,
      isPresale: false,
      isWhitelistOnly: false,
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
    },
  }
}

export const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM,
  )
}

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
