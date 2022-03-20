import * as anchor from '@project-serum/anchor'
import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createATAAccount, loadedKeypair } from './utils'
import { Faucet, IDL } from '../target/types/faucet'
import { getTokenAccount } from '@project-serum/common'

const clusterUrl = clusterApiUrl('devnet')
// const clusterUrl = 'http://localhost:8899'

export const mint = async () => {
  const args = process.argv.slice(2)
  let tokenName: string
  let recipient: PublicKey
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
    }
  }

  if (!tokenName) {
    throw new Error('--name is required')
  }

  if (!recipient) {
    throw new Error('--recipient is required')
  }

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

  const [faucetAccount, faucetAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName)],
    program.programId,
  )
  const [tokenMint, tokenMintBump] = await PublicKey.findProgramAddress(
    [Buffer.from(tokenName), Buffer.from('token_mint')],
    program.programId,
  )

  const recipientATA = await createATAAccount(provider, tokenMint, recipient)
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
  console.log(
    `recipient has ${tokenInfo.amount.div(
      new anchor.BN(10).pow(new anchor.BN('9')),
    )}`,
  )
}

mint()
