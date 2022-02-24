import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { CandyMachine } from '../target/types/candy_machine'

describe('candy_machine', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  // @ts-ignore
  const program = anchor.workspace.CandyMachine as Program<CandyMachine>

  it('Is initialized!', async () => {
    const candyMachineId = 'CnkAuxyHvWj71Bvf7JGvTLG2UR94CA6HgNPuZfbJPkVA'
    const state = await program.account.candyMachine.fetch(candyMachineId)
    console.log(state)
  })
})
