import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Faucet } from '../target/types/faucet'
import faker from 'faker'
import chai, { expect } from 'chai'
import CBN from 'chai-bn'
import CAP from 'chai-as-promised'
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createTokenAccount, getTokenAccount } from './utils'

const TOKEN_NAME = faker.name.firstName().slice(0, 10)
const MINT_AMOUNT_IN_SOL = new anchor.BN(1_000_000)
const DECIMALS = new anchor.BN('9')

const BN = anchor.BN
chai.use(CAP).use(CBN(BN)).should()

function Bumps() {
  this.faucetAccount
  this.tokenMint
}

describe('Faucet', () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Faucet as Program<Faucet>

  let faucetAccount: PublicKey
  let faucetAccountBump: number

  let tokenMint: PublicKey
  let tokenMintBump: number

  const alice = anchor.web3.Keypair.generate()
  let aliceTokenAccount: PublicKey

  before(async () => {
    ;[faucetAccount, faucetAccountBump] = await PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_NAME)],
      program.programId,
    )
    ;[tokenMint, tokenMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_NAME), Buffer.from('token_mint')],
      program.programId,
    )
  })
  it('initialize', async () => {
    const bumps = new Bumps()
    bumps.faucetAccount = faucetAccountBump
    bumps.tokenMint = tokenMintBump

    await program.rpc.initialize(TOKEN_NAME, bumps, DECIMALS, {
      accounts: {
        faucetAuthority: provider.wallet.publicKey,
        faucetAccount,
        tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
  })

  it('mint token from faucet', async () => {
    aliceTokenAccount = await createTokenAccount(
      provider,
      tokenMint,
      alice.publicKey,
    )

    await program.rpc.mint({
      accounts: {
        userAuthority: alice.publicKey,
        faucetAccount,
        tokenMint,
        userTokenAccount: aliceTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [alice],
    })

    const tokenInfo = await getTokenAccount(provider, aliceTokenAccount)
    expect(tokenInfo.amount).to.be.bignumber.eq(
      MINT_AMOUNT_IN_SOL.mul(new BN(10).pow(DECIMALS)),
    )
  })
})
