import * as anchor from '@project-serum/anchor'
import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { getOrCreateATAAccount, loadedKeypair } from './utils'
import { Faucet, IDL } from '../target/types/faucet'
import { getTokenAccount } from '@project-serum/common'

export const mint = async (
  tokenName: string,
  recipient: PublicKey,
  clusterUrl: string,
) => {
  const keypair = loadedKeypair(
    '/Users/supasinliulaks/.config/solana/devnet.json',
  )

  const { publicKey: programId } = loadedKeypair(
    'target/deploy/faucet-keypair.json',
  )

  const connection = new anchor.web3.Connection(clusterUrl)
  const wallet = new anchor.Wallet(keypair)
  const provider = new anchor.Provider(connection, wallet, {
    preflightCommitment: 'processed',
  })
  const program = new anchor.Program<Faucet>(IDL, programId, provider)

  const [faucetAccount] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName)],
    program.programId,
  )
  const [tokenMint] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName), Buffer.from('token_mint')],
    program.programId,
  )

  const recipientATA = await getOrCreateATAAccount(
    provider,
    tokenMint,
    recipient,
  )
  console.log(`mint to: ${recipient.toBase58()}`)
  await program.rpc.mint(new anchor.BN(1_000_000_000_000_000), {
    accounts: {
      userAuthority: provider.wallet.publicKey,
      faucetAccount,
      tokenMint,
      userTokenAccount: recipientATA,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  })

  const tokenInfo = await getTokenAccount(provider, recipientATA)
  console.log(`recipient has ${tokenInfo.amount.toString()} SOLR (lamports)`)
}

async function main() {
  const args = process.argv.slice(2)
  let tokenName: string
  let recipient: PublicKey
  let network = 'devnet'
  let clusterUrl: string
  for (let i = 0; i < args.length; i += 2) {
    const opt = args[i]
    const val = args[i + 1]

    switch (opt) {
      case '--name':
        tokenName = val
        break
      case '--recipient':
        recipient = new PublicKey(val)
        break
      case '--network':
        network = val
        break
    }
  }

  if (!tokenName) {
    throw new Error('--name is required')
  }

  if (!recipient) {
    throw new Error('--recipient is required')
  }

  if (!['devnet', 'testnet', 'localnet'].includes(network)) {
    throw new Error('--network must be one of `devnet`,`testnet` or `localnet`')
  }

  if (network === 'localnet') {
    clusterUrl = 'http://localhost:8899'
  } else {
    clusterUrl = clusterApiUrl(network as anchor.web3.Cluster)
  }
  console.log(`Mint on ${network} (${clusterUrl})`)
  await mint(tokenName, recipient, clusterUrl)
}

main()
