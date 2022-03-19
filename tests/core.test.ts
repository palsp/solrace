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
import { expect } from 'chai'
import faker from 'faker'
import chai from 'chai'
import CBN from 'chai-bn'
import CAP from 'chai-as-promised'
import { SystemProgram, Transaction } from '@solana/web3.js'
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

type PublicKey = anchor.web3.PublicKey

// All mints default to 6 decimal places.
// solr to be distributed
// ~ 0.06 solr pere sec
// const solrAmount = new anchor.BN(90000)
const TOTAL_DISTRIBUTION = new anchor.BN(1_000_000_000_000)
const POOL_NAME = faker.name.firstName().slice(0, 10)
const GARAGE_CREATOR = anchor.web3.Keypair.generate()
const KART_CREATOR = anchor.web3.Keypair.generate()

const START_TIME = new anchor.BN(Date.now() / 1000)
const ELAPSE_TIME = START_TIME.add(new anchor.BN(5))
const END_TIME = ELAPSE_TIME.add(new anchor.BN(20))
const DURATION = END_TIME.sub(START_TIME)
const DISTRIBUTION_PER_SEC = TOTAL_DISTRIBUTION.div(DURATION)

const MAX_MULTIPLIER = new BN('1000')
const MULTIPLIER_UNIT = new BN('100')
const MAX_MULTIPLIER_UNIT = MAX_MULTIPLIER.div(MULTIPLIER_UNIT)

const UPGRADE_FEE_PER_MULTIPLIER = new anchor.BN(20_000_000)
const EXCHANGE_MULTIPLIER_FEE_PER_UNIT = new anchor.BN(500_000_000)

function PoolBumps() {
  this.poolAccount
  this.poolSolr
  this.solrTreasury
}

describe('Sol Race Core Program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.SolRaceCore as Program<SolRaceCore>

  console.log(POOL_NAME)
  console.log(`distribute ${DISTRIBUTION_PER_SEC} solr per sec`)
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
  const cat = anchor.web3.Keypair.generate()
  const dave = anchor.web3.Keypair.generate()
  let aliceSolrTokenAccount: PublicKey
  let aliceGarageMintAccount: Token
  let aliceGarageTokenAccount: PublicKey
  let aliceStakingAccount: PublicKey
  let aliceStakingAccountBump: number
  let alicePendingReward: anchor.BN

  let bobSolrTokenAccount: PublicKey
  let bobGarageMintAccount: Token
  let bobGarageTokenAccount: PublicKey
  let bobStakingAccount: PublicKey
  let bobStakingAccountBump: number

  let catSolrTokenAccount: PublicKey
  let catKartMintAccount: Token
  let catKartTokenAccount: PublicKey
  let catKartAccount: PublicKey
  let catKartAccountBump: number

  let daveSolrTokenAccount: PublicKey
  let daveGarageMintAccount: Token
  let daveGarageTokenAccount: PublicKey
  let daveStakingAccount: PublicKey
  let daveStakingAccountBump: number

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
    await requestSolr(poolAuthority, TOTAL_DISTRIBUTION)
    // request sol
    await requestAirdrop(provider, alice.publicKey)
    await requestAirdrop(provider, bob.publicKey)
    await requestAirdrop(provider, cat.publicKey)
    await requestAirdrop(provider, dave.publicKey)

    // get pool pda account
    ;[poolAccount, poolAccountBump] = await getPoolAccount(program, POOL_NAME)
    ;[poolSolr, poolSolrBump] = await getPoolSolrAccount(program, POOL_NAME)
    ;[solrTreasury, solrTreasuryBump] = await getSolrTreasuryAccount(
      program,
      POOL_NAME,
    )

    // mint garage to alice
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

    // mint garage to bob
    bobGarageMintAccount = await createMint(provider, 0)
    bobGarageTokenAccount = await createTokenAccount(
      provider,
      bobGarageMintAccount.publicKey,
      bob.publicKey,
    )
    await bobGarageMintAccount.mintTo(
      bobGarageTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // mint kart to cat
    catKartMintAccount = await createMint(provider, 0)
    catKartTokenAccount = await createTokenAccount(
      provider,
      catKartMintAccount.publicKey,
      cat.publicKey,
    )
    await catKartMintAccount.mintTo(
      catKartTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // mint garage to dave
    daveGarageMintAccount = await createMint(provider, 0)
    daveGarageTokenAccount = await createTokenAccount(
      provider,
      daveGarageMintAccount.publicKey,
      dave.publicKey,
    )
    await daveGarageMintAccount.mintTo(
      daveGarageTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // init user solr token account
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
    catSolrTokenAccount = await createTokenAccount(
      provider,
      solrMint,
      cat.publicKey,
    )
    daveSolrTokenAccount = await createTokenAccount(
      provider,
      solrMint,
      dave.publicKey,
    )
    // create user pda account
    ;[aliceStakingAccount, aliceStakingAccountBump] = await getStakingAccount(
      program,
      POOL_NAME,
      aliceGarageMintAccount,
    )
    ;[bobStakingAccount, bobStakingAccountBump] = await getStakingAccount(
      program,
      POOL_NAME,
      bobGarageMintAccount,
    )
    ;[catKartAccount, catKartAccountBump] = await getKartAccount(
      program,
      POOL_NAME,
      catKartMintAccount,
    )
    ;[daveStakingAccount, daveStakingAccountBump] = await getStakingAccount(
      program,
      POOL_NAME,
      daveGarageMintAccount,
    )
  })

  it('transfer solr to pool authority', async () => {
    const poolAuthorityInfo = await getTokenAccount(provider, poolAuthority)
    expect(poolAuthorityInfo.amount).to.be.a.bignumber.that.eq(
      TOTAL_DISTRIBUTION,
    )
  })

  it('initialize pool', async () => {
    let bumps = new PoolBumps()

    bumps.poolAccount = poolAccountBump
    bumps.poolSolr = poolSolrBump
    bumps.solrTreasury = solrTreasuryBump

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

    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const poolSolrInfo = await getTokenAccount(provider, poolSolr)
    const poolAuthorityInfo = await getTokenAccount(provider, poolAuthority)

    expect(poolInfo.startTime).to.be.bignumber.equals(START_TIME)
    expect(poolInfo.endTime).to.be.bignumber.equals(END_TIME)

    // check public key
    expect(poolInfo.poolAuthority.toBase58()).to.eq(poolAuthority.toBase58())
    expect(poolInfo.stakingAuthority.toBase58()).to.eq(
      provider.wallet.publicKey.toBase58(),
    )
    expect(poolInfo.poolSolr.toBase58()).to.eq(poolSolr.toBase58())
    expect(poolInfo.garageCreator.toBase58()).to.eq(
      GARAGE_CREATOR.publicKey.toBase58(),
    )
    expect(poolInfo.kartCreator.toBase58()).to.eq(
      KART_CREATOR.publicKey.toBase58(),
    )

    expect(poolInfo.solrMint.toBase58()).to.eq(solrMint.toBase58())

    // check number
    expect(poolInfo.lastDistributed).to.be.a.bignumber.equal(new anchor.BN(0))
    expect(poolInfo.totalDistribution).to.be.a.bignumber.equal(
      TOTAL_DISTRIBUTION,
    )
    expect(poolInfo.totalStaked).to.be.a.bignumber.equal(new anchor.BN(0))
    expect(poolInfo.globalRewardIndex).to.equal(0)

    expect(poolAuthorityInfo.amount).to.be.bignumber.eq(new BN(0))
    expect(poolSolrInfo.amount).to.be.bignumber.eq(TOTAL_DISTRIBUTION)
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
    const stakingInfo = await getStakingAccountInfo(
      program,
      aliceStakingAccount,
    )

    expect(poolInfo.totalStaked).to.be.bignumber.equals(MULTIPLIER_UNIT)
    expect(poolInfo.lastDistributed).to.be.bignumber.greaterThan(new BN(0))
    expect(stakingInfo.isBond).to.be.true
  })

  it('stake bob garage', async () => {
    if (Date.now() < ELAPSE_TIME.toNumber() * 1000 + 1000) {
      await sleep(ELAPSE_TIME.toNumber() * 1000 - Date.now() + 4000)
    }
    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const prevPoolInfo = await getPoolAccountInfo(program, poolAccount)
    const {
      totalDistribution: prevTotalDistribution,
      lastDistributed: prevLastDistributed,
    } = prevPoolInfo

    const instructions = [
      program.instruction.initStake(bobStakingAccountBump, {
        accounts: {
          user: bob.publicKey,
          poolAccount,
          stakingAccount: bobStakingAccount,
          solrMint,
          garageMint: bobGarageMintAccount.publicKey,
          garageTokenAccount: bobGarageTokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [bob],
      }),
      program.instruction.bond({
        accounts: {
          user: bob.publicKey,
          poolAccount,
          stakingAccount: bobStakingAccount,
          garageTokenAccount: bobGarageTokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [bob],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [bob])
    await provider.connection.confirmTransaction(signature)

    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const stakingInfo = await getStakingAccountInfo(program, bobStakingAccount)

    // check pool account state
    const expectedTotalStaked = new BN(2).mul(MULTIPLIER_UNIT)
    expect(poolInfo.totalStaked).to.be.bignumber.equals(expectedTotalStaked)
    expect(poolInfo.lastDistributed).to.be.bignumber.greaterThan(
      prevLastDistributed,
    )
    // check state of staker account
    expect(stakingInfo.isBond).to.be.true

    // update staker reward index
    expect(stakingInfo.rewardIndex).to.equals(poolInfo.globalRewardIndex)
  })

  it('allow cat to upgrade kart by alice`s garage', async () => {
    const multiplier = 1
    const upgradeFee = UPGRADE_FEE_PER_MULTIPLIER.mul(new BN(multiplier))
    await requestSolr(catSolrTokenAccount, upgradeFee)
    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const instructions = [
      program.instruction.initKart(catKartAccountBump, {
        accounts: {
          user: cat.publicKey,
          poolAccount,
          kartAccount: catKartAccount,
          kartMint: catKartMintAccount.publicKey,
          kartTokenAccount: catKartTokenAccount,
          kartMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [cat],
      }),
      program.instruction.upgradeKart({
        accounts: {
          user: cat.publicKey,
          poolAccount,
          kartAccount: catKartAccount,
          stakingAccount: aliceStakingAccount,
          kartTokenAccount: catKartTokenAccount,
          poolSolr,
          solrMint,
          userSolr: catSolrTokenAccount,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [cat],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [cat])
    await provider.connection.confirmTransaction(signature)

    const solrInfo = await getTokenAccount(provider, catSolrTokenAccount)
    const poolSolrInfo = await getTokenAccount(provider, poolSolr)
    const kartInfo = await getKartAccountInfo(program, catKartAccount)

    expect(kartInfo.bump).to.equals(catKartAccountBump)
    expect(kartInfo.kartMint.toBase58()).to.equals(
      catKartMintAccount.publicKey.toBase58(),
    )
    expect(kartInfo.kartMetadataAccount.toBase58()).to.equals(
      metadataAccount.publicKey.toBase58(),
    )
    expect(kartInfo.kartMasterEdition.toBase58()).to.equals(
      masterEdition.publicKey.toBase58(),
    )
    expect(solrInfo.amount).to.be.bignumber.eq('0')
    expect(poolSolrInfo.amount).to.be.bignumber.eq(
      TOTAL_DISTRIBUTION.add(upgradeFee),
    )
  })

  it('allow cat to upgrade kart by bob`s garage', async () => {
    const multiplier = 1
    const upgradeFee = UPGRADE_FEE_PER_MULTIPLIER.mul(new BN(multiplier))
    await requestSolr(catSolrTokenAccount, upgradeFee)
    const prevKartInfo = await getKartAccountInfo(program, catKartAccount)
    const {
      totalDistribution: prevTotalDistribution,
    } = await getPoolAccountInfo(program, poolAccount)

    await program.rpc.upgradeKart({
      accounts: {
        user: cat.publicKey,
        poolAccount,
        kartAccount: catKartAccount,
        stakingAccount: bobStakingAccount,
        kartTokenAccount: catKartTokenAccount,
        poolSolr,
        userSolr: catSolrTokenAccount,
        solrMint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [cat],
    })

    const kartInfo = await getKartAccountInfo(program, catKartAccount)
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

    const solrInfo = await getTokenAccount(provider, catSolrTokenAccount)
    const { totalDistribution } = await getPoolAccountInfo(program, poolAccount)

    expect(solrInfo.amount).to.be.bignumber.eq('0')
    expect(totalDistribution).to.be.bignumber.eq(
      prevTotalDistribution.add(upgradeFee),
    )
  })

  it('unstake alice garage', async () => {
    const { globalRewardIndex: prevGlobalReward } = await getPoolAccountInfo(
      program,
      poolAccount,
    )

    const {
      rewardIndex: prevRewardIndex,
      pendingReward: prevPendingReward,
    } = await getStakingAccountInfo(program, aliceStakingAccount)

    await program.rpc.unBond({
      accounts: {
        user: alice.publicKey,
        poolAccount,
        stakingAccount: aliceStakingAccount,
        solrMint,
        garageTokenAccount: aliceGarageTokenAccount,
        systemProgram: SystemProgram.programId,
      },
      signers: [alice],
    })

    const stakerInfo = await getStakingAccountInfo(program, aliceStakingAccount)
    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const newReward = poolInfo.globalRewardIndex - prevRewardIndex
    expect(poolInfo.globalRewardIndex).greaterThan(prevGlobalReward)
    expect(poolInfo.totalStaked).to.be.bignumber.equals(MULTIPLIER_UNIT)
    expect(stakerInfo.pendingReward).to.be.bignumber.greaterThan('0')
    expect(stakerInfo.pendingReward).to.be.bignumber.equals(
      prevPendingReward.add(new BN(newReward)),
    )
    expect(stakerInfo.rewardIndex).to.equals(poolInfo.globalRewardIndex)
    expect(stakerInfo.isBond).to.be.false
    alicePendingReward = stakerInfo.pendingReward
  })

  it('not allow bob to stake alice staking account', async () => {
    try {
      await program.rpc.bond({
        accounts: {
          user: bob.publicKey,
          poolAccount,
          stakingAccount: aliceStakingAccount,
          garageTokenAccount: bobGarageTokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [bob],
      })
      expect.fail('should not pass')
    } catch (e) {
      expect(e.message).to.eq('6002: Invalid mint')
    }
  })

  it('allow alice to restake', async () => {
    await program.rpc.bond({
      accounts: {
        user: alice.publicKey,
        poolAccount,
        stakingAccount: aliceStakingAccount,
        solrMint,
        garageTokenAccount: aliceGarageTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [alice],
    })

    const stakerInfo = await getStakingAccountInfo(program, aliceStakingAccount)

    expect(stakerInfo.pendingReward).to.be.bignumber.equals(alicePendingReward)
    expect(stakerInfo.isBond).to.be.true
  })

  it('not allow cat to withdraw from alice staking account', async () => {
    try {
      await program.rpc.withdraw({
        accounts: {
          user: cat.publicKey,
          poolAccount,
          stakingAccount: aliceStakingAccount,
          poolSolr,
          garageTokenAccount: aliceGarageTokenAccount,
          solrMint,
          userSolr: catSolrTokenAccount,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [cat],
      })
      expect.fail('should not be reach')
    } catch (e) {}
  })

  it('withdraw', async () => {
    let solrInfo = await getTokenAccount(provider, aliceSolrTokenAccount)
    expect(solrInfo.amount).to.be.bignumber.eq('0')
    await program.rpc.withdraw({
      accounts: {
        user: alice.publicKey,
        poolAccount,
        stakingAccount: aliceStakingAccount,
        poolSolr,
        garageTokenAccount: aliceGarageTokenAccount,
        solrMint,
        userSolr: aliceSolrTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [alice],
    })

    solrInfo = await getTokenAccount(provider, aliceSolrTokenAccount)
    const stakingInfo = await getStakingAccountInfo(
      program,
      aliceStakingAccount,
    )
    expect(solrInfo.amount).to.be.bignumber.greaterThan('0')

    expect(stakingInfo.pendingReward).to.be.bignumber.eq('0')
  })

  it('allow transferred nft to be staked', async () => {
    await program.rpc.unBond({
      accounts: {
        user: alice.publicKey,
        poolAccount,
        stakingAccount: aliceStakingAccount,
        solrMint,
        garageTokenAccount: aliceGarageTokenAccount,
        systemProgram: SystemProgram.programId,
      },
      signers: [alice],
    })

    const bobAliceGarageTokenAccount = await createTokenAccount(
      provider,
      aliceGarageMintAccount.publicKey,
      bob.publicKey,
    )

    const tx = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        aliceGarageTokenAccount,
        bobAliceGarageTokenAccount,
        alice.publicKey,
        [],
        1,
      ),
    )

    await provider.send(tx, [alice])
    const { amount: aliceBalance } = await getTokenAccount(
      provider,
      aliceGarageTokenAccount,
    )
    const { amount: bobBalance } = await getTokenAccount(
      provider,
      bobAliceGarageTokenAccount,
    )
    expect(aliceBalance).to.be.bignumber.eq('0')
    expect(bobBalance).to.be.bignumber.eq('1')

    let { isBond } = await getStakingAccountInfo(program, aliceStakingAccount)
    expect(isBond).to.be.false

    await program.rpc.bond({
      accounts: {
        user: bob.publicKey,
        poolAccount,
        stakingAccount: aliceStakingAccount,
        solrMint,
        garageTokenAccount: bobAliceGarageTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [bob],
    })
    ;({ isBond } = await program.account.stakingAccount.fetch(
      aliceStakingAccount,
    ))
    expect(isBond).to.be.true
  })

  it('not distribute reward if distribution period is end', async () => {
    if (Date.now() < END_TIME.toNumber() * 1000 + 1000) {
      await sleep(END_TIME.toNumber() * 1000 - Date.now() + 4000)
    }
    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const instructions = [
      program.instruction.initStake(daveStakingAccountBump, {
        accounts: {
          user: dave.publicKey,
          poolAccount,
          stakingAccount: daveStakingAccount,
          solrMint,
          garageMint: daveGarageMintAccount.publicKey,
          garageTokenAccount: daveGarageTokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [dave],
      }),
      program.instruction.bond({
        accounts: {
          user: dave.publicKey,
          poolAccount,
          stakingAccount: daveStakingAccount,
          garageTokenAccount: daveGarageTokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [dave],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [dave])
    await provider.connection.confirmTransaction(signature)

    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const stakingInfo = await getStakingAccountInfo(program, daveStakingAccount)

    expect(stakingInfo.isBond).to.be.true

    expect(stakingInfo.pendingReward).to.be.bignumber.equals(new BN(0))
    expect(stakingInfo.rewardIndex).to.equals(poolInfo.globalRewardIndex)
  })
})
