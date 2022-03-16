import { Connection, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, setProvider, web3 } from '@project-serum/anchor'
import { SolRaceCore, IDL } from 'idl/sol_race_core'
import { SOL_RACE_CORE_PROGRAM_ID } from 'solana/addresses'
import { NodeWallet } from '@metaplex/js'

const clusterUrl =
  process.env.SOLANA_CLUSTER_URL || clusterApiUrl('mainnet-beta')

export const connection = new Connection(clusterUrl, 'processed')

/**
 * throw away keypair use for read data only
 */
const keypair = web3.Keypair.generate()

export const provider = new Provider(connection, new NodeWallet(keypair), {})

export const solraceProgram = new Program<SolRaceCore>(
  IDL,
  SOL_RACE_CORE_PROGRAM_ID,
  provider,
)
