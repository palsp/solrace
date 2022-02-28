import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { CandyMachine } from '../target/types/candy_machine'
import { SolRaceStaking } from '../target/types/sol_race_staking'

describe('candy_machine', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  // @ts-ignore
  const program = anchor.workspace.CandyMachine as Program<SolRaceStaking>

  it('Is initialized!', async () => {})
})
