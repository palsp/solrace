import * as anchor from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection } from '@solana/wallet-adapter-react'
import { COLLECTION_PROGRAM_ID } from '~/utils/contract'
import { useWorkspace } from '~/workspace/hooks'

export interface CandyMachine {
  id: anchor.web3.PublicKey
}

interface CandyMachineState {
  candyMachine: CandyMachine
  itemsAvailable: number
  itemsRedeemed: number
  itemsRemaining: number
  goLiveDate: Date
}

export const useContract = () => {
  const { wallet, program, provider } = useWorkspace()
  const { connection } = useConnection()

  const fetchCollection = async (
    programId: anchor.web3.PublicKey,
  ): Promise<CandyMachineState> => {
    const state: any = await program?.account.candyMachine.fetch(programId)

    console.log(state)
    const itemsAvailable = state.data.itemsAvailable.toNumber()
    const itemsRedeemed = state.itemsRedeemed.toNumber()
    const itemsRemaining = itemsAvailable - itemsRedeemed
    let goLiveDate = state.data.goLiveDate.toNumber()
    goLiveDate = new Date(goLiveDate * 1000)

    return {
      candyMachine: {
        id: programId,
      },
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveDate,
    }
  }

  const fetchNftOfOwner = async (
    owner: anchor.web3.PublicKey,
    collection: anchor.web3.PublicKey,
  ) => {
    const parsedTokenAccount = await connection.getParsedProgramAccounts(
      COLLECTION_PROGRAM_ID,
    )
    console.log(parsedTokenAccount)
    // for (const tokenAccountInfo of parsedTokenAccount.value) {
    //   const tokenAccountPubKey = tokenAccountInfo.pubkey
    //   const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58()
    //   const parsedInfo = tokenAccountInfo.account.data.parsed.info
    //   const mintAddress = parsedInfo.mint
    //   console.log(tokenAccountInfo)
    // }
  }

  return { fetchCollection, fetchNftOfOwner }
}
