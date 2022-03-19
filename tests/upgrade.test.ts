import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SolRaceCore } from '../target/types/sol_race_core'
import {
  createMint,
  createTokenAccount,
  getTokenAccount,
  mockCreateAndMintNFT,
  requestAirdrop,
  sleep,
} from './utils'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { expect, util } from 'chai'
import faker from 'faker'
import chai from 'chai'
import CBN from 'chai-bn'
import CAP from 'chai-as-promised'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import {
  getKartAccount,
  getKartAccountInfo,
  getPoolAccount,
  getPoolAccountInfo,
  getPoolSolrAccount,
  getSolrTreasuryAccount,
  getStakingAccount,
  getStakingAccountInfo,
} from './utils/account'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

const BN = anchor.BN
chai.use(CAP).use(CBN(BN)).should()

const TOTAL_DISTRIBUTION = new anchor.BN(1_000_000_000_000)
const POOL_NAME = faker.name.firstName().slice(0, 10)
const GARAGE_CREATOR = anchor.web3.Keypair.generate()
const KART_CREATOR = anchor.web3.Keypair.generate()
const START_TIME = new anchor.BN(Date.now() / 1000)
const ELAPSE_TIME = START_TIME.add(new anchor.BN(5))
const END_TIME = ELAPSE_TIME.add(new anchor.BN(20))
const MAX_MULTIPLIER = new BN('1000')
const MULTIPLIER_UNIT = new BN('100')
const MAX_MULTIPLIER_UNIT = MAX_MULTIPLIER.div(MULTIPLIER_UNIT)

const UPGRADE_FEE_PER_MULTIPLIER = new anchor.BN(20_000_000)
const EXCHANGE_MULTIPLIER_FEE_PER_UNIT = new anchor.BN(500_000_000)

const DURATION = END_TIME.sub(START_TIME)

function PoolBumps() {
  this.poolAccount
  this.poolSolr
  this.solrTreasury
}

describe('Upgrading Kart', () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.SolRaceCore as Program<SolRaceCore>
  let solrMintAccount: Token
  let solrMint: PublicKey

  let stakingAuthority: PublicKey
  let poolAuthority: PublicKey

  let poolAccount: PublicKey
  let poolAccountBump: number

  let poolSolr: PublicKey
  let poolSolrBump: number

  let solrTreasury: PublicKey
  let solrTreasuryBump: number

  const alice = anchor.web3.Keypair.generate()
  const bob = anchor.web3.Keypair.generate()
  let aliceSolrTokenAccount: PublicKey
  let aliceGarageMintAccount: Token
  let aliceGarageTokenAccount: PublicKey
  let bobSolrTokenAccount: PublicKey
  let bobKartMintAccount: Token
  let bobKartTokenAccount: PublicKey

  let aliceStakingAccount: PublicKey
  let aliceStakingAccountBump: number

  let bobKartAccount: PublicKey
  let bobKartAccountBump: number

  const requestSolr = async (recipient: PublicKey, amount: anchor.BN) => {
    await solrMintAccount.mintTo(
      recipient,
      provider.wallet.publicKey,
      [],
      amount.toNumber(),
    )
  }

  before(async () => {
    solrMintAccount = await createMint(provider)
    solrMint = solrMintAccount.publicKey

    poolAuthority = await createTokenAccount(
      provider,
      solrMint,
      provider.wallet.publicKey,
    )

    await solrMintAccount.mintTo(
      poolAuthority,
      provider.wallet.publicKey,
      [],
      TOTAL_DISTRIBUTION.toNumber(),
    )
    ;[poolAccount, poolAccountBump] = await getPoolAccount(program, POOL_NAME)
    ;[poolSolr, poolSolrBump] = await getPoolSolrAccount(program, POOL_NAME)
    ;[solrTreasury, solrTreasuryBump] = await getSolrTreasuryAccount(
      program,
      POOL_NAME,
    )

    aliceGarageMintAccount = await createMint(provider, 0)
    aliceGarageTokenAccount = await createTokenAccount(
      provider,
      aliceGarageMintAccount.publicKey,
      alice.publicKey,
    )

    await aliceGarageMintAccount.mintTo(
      aliceGarageTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // initialize user solr token account
    aliceSolrTokenAccount = await createTokenAccount(
      provider,
      solrMint,
      alice.publicKey,
    )

    bobSolrTokenAccount = await createTokenAccount(
      provider,
      solrMint,
      bob.publicKey,
    )

    bobKartMintAccount = await createMint(provider, 0)
    bobKartTokenAccount = await createTokenAccount(
      provider,
      bobKartMintAccount.publicKey,
      bob.publicKey,
    )

    await bobKartMintAccount.mintTo(
      bobKartTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // get program account and bumps
    ;[aliceStakingAccount, aliceStakingAccountBump] = await getStakingAccount(
      program,
      POOL_NAME,
      aliceGarageMintAccount,
    )
    ;[bobKartAccount, bobKartAccountBump] = await getKartAccount(
      program,
      POOL_NAME,
      bobKartMintAccount,
    )

    // request sol
    await requestAirdrop(provider, alice.publicKey)
    await requestAirdrop(provider, bob.publicKey)
  })

  it('initialize pool', async () => {
    let bumps = new PoolBumps()

    bumps.poolAccount = poolAccountBump
    bumps.poolSolr = poolSolrBump
    bumps.solrTreasury

    await program.rpc.initialize(
      POOL_NAME,
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
          garageCreator: GARAGE_CREATOR.publicKey,
          kartCreator: KART_CREATOR.publicKey,
          solrTreasury,
          solrMint,
          poolSolr,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      },
    )
  })

  it('stake alice garage', async () => {
    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const instructions = [
      program.instruction.initStake(aliceStakingAccountBump, {
        accounts: {
          user: alice.publicKey,
          poolAccount,
          stakingAccount: aliceStakingAccount,
          solrMint,
          garageMint: aliceGarageMintAccount.publicKey,
          garageTokenAccount: aliceGarageTokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [alice],
      }),
      program.instruction.bond({
        accounts: {
          user: alice.publicKey,
          poolAccount,
          stakingAccount: aliceStakingAccount,
          solrMint,
          garageTokenAccount: aliceGarageTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [alice],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))
    const signature = await provider.send(transaction, [alice])
    await provider.connection.confirmTransaction(signature)

    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const stakeInfo = await getStakingAccountInfo(program, aliceStakingAccount)

    expect(poolInfo.totalStaked).to.be.bignumber.equals(MULTIPLIER_UNIT)
    expect(poolInfo.totalDistribution).to.be.bignumber.eq(TOTAL_DISTRIBUTION)
    expect(stakeInfo.multiplier).to.be.bignumber.equal(MULTIPLIER_UNIT)
    expect(stakeInfo.isBond).to.be.true
  })

  it('upgrade bob kart', async () => {
    const fee = UPGRADE_FEE_PER_MULTIPLIER
    await requestSolr(bobSolrTokenAccount, fee)

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const instructions = [
      program.instruction.initKart(bobKartAccountBump, {
        accounts: {
          user: bob.publicKey,
          poolAccount,
          kartAccount: bobKartAccount,
          kartMint: bobKartMintAccount.publicKey,
          kartTokenAccount: bobKartTokenAccount,
          kartMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [bob],
      }),
      program.instruction.upgradeKart({
        accounts: {
          user: bob.publicKey,
          poolAccount,
          kartAccount: bobKartAccount,
          stakingAccount: aliceStakingAccount,
          kartTokenAccount: bobKartTokenAccount,
          poolSolr,
          solrMint,
          userSolr: bobSolrTokenAccount,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [bob],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [bob])
    await provider.connection.confirmTransaction(signature)

    // get program account info
    const kartInfo = await getKartAccountInfo(program, bobKartAccount)
    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const poolSolrInfo = await getTokenAccount(provider, poolSolr)

    expect(poolInfo.totalDistribution).to.be.bignumber.eq(
      TOTAL_DISTRIBUTION.add(fee),
    )
    expect(poolSolrInfo.amount).to.be.bignumber.eq(TOTAL_DISTRIBUTION.add(fee))

    // x1 multiplier
    expect(kartInfo.maxSpeed).to.equals(1)
    expect(kartInfo.acceleration).to.equals(25)
    expect(kartInfo.driftPowerConsumptionRate).to.equals(0.02)
    expect(kartInfo.driftPowerGenerationRate).to.equals(0.02)
    expect(kartInfo.handling).to.equals(10)
  })

  it('reverts if alice wants units that exceed MAX_MULTIPLIER_UNIT', async () => {
    const units = MAX_MULTIPLIER_UNIT.add(new anchor.BN('1'))

    try {
      await program.rpc.exchangeForMultiplier(units, {
        accounts: {
          user: alice.publicKey,
          poolAccount,
          userSolr: aliceSolrTokenAccount,
          solrTreasury,
          solrMint,
          stakingAccount: aliceStakingAccount,
          garageTokenAccount: aliceGarageTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [alice],
      })

      expect.fail('should not passed')
    } catch (e) {
      expect(e.message).to.eq('6012: Max Multiplier Reach')
    }
  })

  it('reverts if user has insufficient solr', async () => {
    const units = new anchor.BN('5')

    try {
      await program.rpc.exchangeForMultiplier(units, {
        accounts: {
          user: alice.publicKey,
          poolAccount,
          userSolr: aliceSolrTokenAccount,
          solrTreasury,
          solrMint,
          stakingAccount: aliceStakingAccount,
          garageTokenAccount: aliceGarageTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [alice],
      })

      expect.fail('should not passed')
    } catch (e) {
      expect(e.message).to.eq('6013: Insufficient Fund')
    }
  })

  it('exchange solr for multiplier', async () => {
    const currentUnits = new anchor.BN('1')
    const units = new anchor.BN('5')
    const newUnits = currentUnits.add(units)
    const newMultiplier = newUnits.mul(MULTIPLIER_UNIT)
    const expectedSolr = EXCHANGE_MULTIPLIER_FEE_PER_UNIT.mul(newUnits)
    await requestSolr(aliceSolrTokenAccount, expectedSolr)

    await program.rpc.exchangeForMultiplier(units, {
      accounts: {
        user: alice.publicKey,
        poolAccount,
        userSolr: aliceSolrTokenAccount,
        solrTreasury,
        solrMint,
        stakingAccount: aliceStakingAccount,
        garageTokenAccount: aliceGarageTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [alice],
    })

    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const stakingInfo = await getStakingAccountInfo(
      program,
      aliceStakingAccount,
    )

    expect(stakingInfo.multiplier).to.be.bignumber.eq(newMultiplier)
    expect(poolInfo.totalStaked).to.be.bignumber.eq(newMultiplier)
  })

  it('increase upgrading fee', async () => {
    try {
      await program.rpc.upgradeKart({
        accounts: {
          user: bob.publicKey,
          poolAccount,
          kartAccount: bobKartAccount,
          stakingAccount: aliceStakingAccount,
          kartTokenAccount: bobKartTokenAccount,
          poolSolr,
          solrMint,
          userSolr: bobSolrTokenAccount,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [bob],
      })
      expect.fail('should not pass')
    } catch (e) {
      expect(e.message).to.eq('6013: Insufficient Fund')
    }

    const multiplier = 6
    const fee = new BN(multiplier).mul(UPGRADE_FEE_PER_MULTIPLIER)
    await requestSolr(bobSolrTokenAccount, fee)
    const prevKartInfo = await getKartAccountInfo(program, bobKartAccount)

    await program.rpc.upgradeKart({
      accounts: {
        user: bob.publicKey,
        poolAccount,
        kartAccount: bobKartAccount,
        stakingAccount: aliceStakingAccount,
        kartTokenAccount: bobKartTokenAccount,
        poolSolr,
        solrMint,
        userSolr: bobSolrTokenAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [bob],
    })

    const kartInfo = await getKartAccountInfo(program, bobKartAccount)
    const expectedMaxSpeed = prevKartInfo.maxSpeed + multiplier
    const expectedAcceleration = prevKartInfo.acceleration + 25 * multiplier
    const expectedDriftPowerConsumptionRate =
      prevKartInfo.driftPowerConsumptionRate + 0.02 * multiplier
    const expectedDriftPowerGenerationRate =
      prevKartInfo.driftPowerGenerationRate + 0.02 * multiplier
    const expectedHandling = prevKartInfo.handling + 10 * multiplier

    expect(kartInfo.maxSpeed).to.equals(expectedMaxSpeed)
    expect(kartInfo.acceleration).to.equals(expectedAcceleration)
    expect(kartInfo.driftPowerConsumptionRate).to.equals(
      expectedDriftPowerConsumptionRate,
    )
    expect(kartInfo.driftPowerGenerationRate).to.equals(
      expectedDriftPowerGenerationRate,
    )
    expect(kartInfo.handling).to.equals(expectedHandling)
  })
})
