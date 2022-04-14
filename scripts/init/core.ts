import * as anchor from '@project-serum/anchor'
import {
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { loadedKeypair } from '../utils'
import { SolRaceCore, IDL } from '../../target/types/sol_race_core'
import {
  getPoolAccount,
  getPoolSolrAccount,
  getSolrTreasuryAccount,
} from '../../tests/utils/account'
import { createTokenAccount } from '@project-serum/common'

function PoolBumps() {
  this.poolAccount
  this.poolSolr
  this.solrTreasury
}

// 1000000 SOLR distribute in one year
const TOTAL_DISTRIBUTION = new anchor.BN(1_000_000_000_000_000)
// distribute for one year
const START_TIME = new anchor.BN(Date.now() / 1000)
const END_TIME = START_TIME.add(new anchor.BN(365 * 24 * 60 * 60))

const DURATION = END_TIME.sub(START_TIME)
const DISTRIBUTION_PER_SEC = TOTAL_DISTRIBUTION.div(new anchor.BN(10 ** 9)).div(
  DURATION,
)
const MAX_MULTIPLIER = new anchor.BN('1000')
const MULTIPLIER_UNIT = new anchor.BN('100')

const garageCreator = new PublicKey(
  'BrdAi9KnJrMMjjRAMBr4QLft2PpEyR3L6wp2ruceovhS',
)
const kartCreator = new PublicKey(
  '7uGWKJKxKvxE1Hx5G4L9WMoUJyXcYjoqtpRg27kErVZk',
)

export const deployCore = async (
  poolName: string,
  poolAuthority: PublicKey,
  solrMint: PublicKey,
  clusterUrl: string,
) => {
  console.log(`Initialize ${poolName} pool`)

  const keypair = loadedKeypair(
    '/Users/supasinliulaks/.config/solana/devnet.json',
  )

  const { publicKey: programId } = loadedKeypair(
    'target/deploy/sol_race_core-keypair.json',
  )

  const connection = new anchor.web3.Connection(clusterUrl)
  const wallet = new anchor.Wallet(keypair)
  const provider = new anchor.Provider(connection, wallet, {
    preflightCommitment: 'processed',
  })
  const program = new anchor.Program<SolRaceCore>(IDL, programId, provider)

  const [poolAccount, poolAccountBump] = await getPoolAccount(program, poolName)
  const [poolSolr, poolSolrBump] = await getPoolSolrAccount(program, poolName)
  const [solrTreasury, solrTreasuryBump] = await getSolrTreasuryAccount(
    program,
    poolName,
  )

  const bumps = new PoolBumps()

  bumps.poolAccount = poolAccountBump
  bumps.poolSolr = poolSolrBump
  bumps.solrTreasury = solrTreasuryBump

  await program.rpc.initialize(
    poolName,
    bumps,
    TOTAL_DISTRIBUTION,
    START_TIME,
    END_TIME,
    MULTIPLIER_UNIT,
    MAX_MULTIPLIER,
    {
      accounts: {
        signer: provider.wallet.publicKey,
        poolAccount,
        stakingAuthority: provider.wallet.publicKey,
        poolAuthority,
        garageCreator,
        kartCreator,
        solrTreasury,
        solrMint,
        poolSolr,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    },
  )

  console.table({
    poolName,
    solrMint: solrMint.toBase58(),
    poolAuthority: poolAuthority.toBase58(),
  })

  console.log('deploy success')
}

async function main() {
  const args = process.argv.slice(2)

  let poolName: string
  let poolAuthority: PublicKey
  let solrMint: PublicKey
  let network = 'devnet'
  let clusterUrl: string
  for (let i = 0; i < args.length; i += 2) {
    const opt = args[i]
    const val = args[i + 1]

    switch (opt) {
      case '--solr-mint':
        solrMint = new PublicKey(val)
        break
      case '--pool-name':
        poolName = val
        break
      case '--pool-authority':
        poolAuthority = new PublicKey(val)
        break
      case '--network':
        network = val
        break
    }
  }

  if (!solrMint) {
    throw new Error('--solr-mint is required')
  }

  if (!poolAuthority) {
    throw new Error('--pool-authority is required')
  }

  if (!poolName || poolName === '') {
    throw new Error('--pool-name is required')
  }

  if (!['devnet', 'testnet', 'localnet'].includes(network)) {
    throw new Error('--network must be one of `devnet`,`testnet` or `localnet`')
  }

  if (network === 'localnet') {
    clusterUrl = 'http://localhost:8899'
  } else {
    clusterUrl = clusterApiUrl(network as anchor.web3.Cluster)
  }

  console.log(`Deploy on ${network} (${clusterUrl})`)
  await deployCore(poolName, poolAuthority, solrMint, clusterUrl)
}

main()
