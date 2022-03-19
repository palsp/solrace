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

const BN = anchor.BN

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
  getStakingAccount,
  getStakingAccountInfo,
} from './utils/account'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

chai.use(CAP).use(CBN(BN)).should()

type PublicKey = anchor.web3.PublicKey

function PoolBumps() {
  this.poolAccount
  this.poolSolr
}

describe('Sol Race Core Program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.SolRaceCore as Program<SolRaceCore>

  // All mints default to 6 decimal places.
  // solr to be distributed
  // ~ 0.06 solr pere sec
  // const solrAmount = new anchor.BN(90000)
  const solrAmount = new anchor.BN(96666)

  const poolName = faker.name.firstName().slice(0, 10)
  console.log(poolName)

  const garageCreator = anchor.web3.Keypair.generate()
  const kartCreator = anchor.web3.Keypair.generate()

  let solrMintAccount: Token
  let solrMint: PublicKey

  let stakingAuthority: PublicKey
  let poolAuthority: PublicKey

  let poolAccount: PublicKey
  let poolAccountBump: number

  let poolSolr: PublicKey
  let poolSolrBump: number

  const updatedFee = new anchor.BN(2000000)

  it('Is initialized!', async () => {
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
      solrAmount.toNumber(),
    )

    const _poolAuthorityAccount = await getTokenAccount(provider, poolAuthority)
    expect(_poolAuthorityAccount.amount).to.be.a.bignumber.that.equals(
      solrAmount,
    )
  })

  let startTime = new anchor.BN(Date.now() / 1000)
  let elapseTime = startTime.add(new anchor.BN(5))
  let endTime = elapseTime.add(new anchor.BN(15))

  const time = endTime.sub(startTime)

  const distributedPerSec = solrAmount.div(time)

  console.log(`distribute ${distributedPerSec} solr per sec`)

  before(async () => {
    ;[poolAccount, poolAccountBump] = await getPoolAccount(program, poolName)
    ;[poolSolr, poolSolrBump] = await getPoolSolrAccount(program, poolName)
  })

  it('initialize pool', async () => {
    let bumps = new PoolBumps()

    bumps.poolAccount = poolAccountBump
    bumps.poolSolr = poolSolrBump

    await program.rpc.initialize(
      poolName,
      bumps,
      solrAmount,
      startTime,
      endTime,
      {
        accounts: {
          signer: provider.wallet.publicKey,
          poolAccount,
          stakingAuthority: provider.wallet.publicKey,
          poolAuthority,
          garageCreator: garageCreator.publicKey,
          kartCreator: kartCreator.publicKey,
          solrMint,
          poolSolr,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      },
    )

    const poolAccountInfo = await getPoolAccountInfo(program, poolAccount)

    expect(poolAccountInfo.startTime).to.be.bignumber.equals(startTime)
    expect(poolAccountInfo.endTime).to.be.bignumber.equals(endTime)

    // check public key
    expect(poolAccountInfo.poolAuthority.toBase58()).to.eq(
      poolAuthority.toBase58(),
    )
    expect(poolAccountInfo.stakingAuthority.toBase58()).to.eq(
      provider.wallet.publicKey.toBase58(),
    )
    expect(poolAccountInfo.poolSolr.toBase58()).to.eq(poolSolr.toBase58())

    expect(poolAccountInfo.garageCreator.toBase58()).to.eq(
      garageCreator.publicKey.toBase58(),
    )

    expect(poolAccountInfo.kartCreator.toBase58()).to.eq(
      kartCreator.publicKey.toBase58(),
    )

    expect(poolAccountInfo.solrMint.toBase58()).to.eq(solrMint.toBase58())

    // check number
    expect(poolAccountInfo.lastDistributed).to.be.a.bignumber.equal(
      new anchor.BN(0),
    )
    expect(poolAccountInfo.totalDistribution).to.be.a.bignumber.equal(
      solrAmount,
    )

    expect(poolAccountInfo.totalStaked).to.be.a.bignumber.equal(
      new anchor.BN(0),
    )
    expect(poolAccountInfo.globalRewardIndex).to.equal(0)

    expect(poolAccountInfo.startTime).to.be.a.bignumber.equal(startTime)
    expect(poolAccountInfo.endTime).to.be.a.bignumber.equal(endTime)

    const poolAuthorityTokenAccountInfo = await getTokenAccount(
      provider,
      poolAuthority,
    )

    expect(poolAuthorityTokenAccountInfo.amount).to.be.bignumber.eq(new BN(0))

    const poolSolrTokenAccountInfo = await getTokenAccount(provider, poolSolr)

    expect(poolSolrTokenAccountInfo.amount).to.be.bignumber.eq(solrAmount)
  })

  const staker = anchor.web3.Keypair.generate()

  let garageMintAccount: Token
  let garageTokenAccount: PublicKey
  it('stake user token', async () => {
    // request sol
    const tx = await provider.connection.requestAirdrop(
      staker.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    garageMintAccount = await createMint(provider, 0)
    garageTokenAccount = await createTokenAccount(
      provider,
      garageMintAccount.publicKey,
      staker.publicKey,
    )
    await garageMintAccount.mintTo(
      garageTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const [
      stakingAccount,
      stakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        garageMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const instructions = [
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user: staker.publicKey,
          poolAccount,
          stakingAccount,
          solrMint,
          garageMint: garageMintAccount.publicKey,
          garageTokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker],
      }),
      program.instruction.bond({
        accounts: {
          user: staker.publicKey,
          poolAccount,
          stakingAccount,
          solrMint,
          garageTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [staker])
    await provider.connection.confirmTransaction(signature)

    const poolAccountInfo = await getPoolAccountInfo(program, poolAccount)
    const stakingAccountInfo = await getStakingAccountInfo(
      program,
      stakingAccount,
    )

    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(1))

    expect(poolAccountInfo.lastDistributed).to.be.bignumber.greaterThan(
      new BN(0),
    )

    expect(stakingAccountInfo.isBond).to.be.true
  })

  const staker2 = anchor.web3.Keypair.generate()
  let garage2MintAccount: Token
  let garage2TokenAccount: PublicKey
  it('stake another user token', async () => {
    if (Date.now() < elapseTime.toNumber() * 1000 + 1000) {
      await sleep(elapseTime.toNumber() * 1000 - Date.now() + 4000)
    }

    // request sol
    const tx = await provider.connection.requestAirdrop(
      staker2.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    garage2MintAccount = await createMint(provider, 0)
    garage2TokenAccount = await createTokenAccount(
      provider,
      garage2MintAccount.publicKey,
      staker2.publicKey,
    )
    await garage2MintAccount.mintTo(
      garage2TokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const { lastDistributed: prevLastDistributed } = await getPoolAccountInfo(
      program,
      poolAccount,
    )

    const [stakingAccount, stakingAccountBump] = await getStakingAccount(
      program,
      poolName,
      garage2MintAccount,
    )

    const instructions = [
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user: staker2.publicKey,
          poolAccount,
          stakingAccount,
          solrMint,
          garageMint: garage2MintAccount.publicKey,
          garageTokenAccount: garage2TokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker2],
      }),
      program.instruction.bond({
        accounts: {
          user: staker2.publicKey,
          poolAccount,
          stakingAccount,
          garageTokenAccount: garage2TokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker2],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [staker2])
    await provider.connection.confirmTransaction(signature)

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)
    const stakingAccountInfo = await program.account.stakingAccount.fetch(
      stakingAccount,
    )

    // check pool account state
    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(2))
    expect(poolAccountInfo.lastDistributed).to.be.bignumber.greaterThan(
      prevLastDistributed,
    )

    // check state of staker account
    expect(stakingAccountInfo.isBond).to.be.true

    // update staker reward index
    expect(stakingAccountInfo.rewardIndex).to.equals(
      poolAccountInfo.globalRewardIndex,
    )
  })

  const user = anchor.web3.Keypair.generate()
  let userSolrTokenAccount: PublicKey
  let kartMintAccount: Token
  let kartTokenAccount: PublicKey
  it('allow user to upgrade kart by first  garage', async () => {
    // request sol
    await requestAirdrop(provider, user.publicKey)
    ;({
      mint: kartMintAccount,
      tokenAccount: kartTokenAccount,
    } = await mockCreateAndMintNFT(provider, user.publicKey))

    userSolrTokenAccount = await createTokenAccount(
      provider,
      solrMintAccount.publicKey,
      user.publicKey,
    )

    await solrMintAccount.mintTo(
      userSolrTokenAccount,
      provider.wallet.publicKey,
      [],
      updatedFee.toNumber(),
    )

    let userSolrTokenAccountInfo = await getTokenAccount(
      provider,
      userSolrTokenAccount,
    )
    expect(userSolrTokenAccountInfo.amount).to.be.bignumber.eq(updatedFee)

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    const [kartAccount, kartAccountBump] = await getKartAccount(
      program,
      poolName,
      kartMintAccount,
    )

    const instructions = [
      program.instruction.initKart(kartAccountBump, {
        accounts: {
          user: user.publicKey,
          poolAccount,
          kartAccount,
          kartMint: kartMintAccount.publicKey,
          kartTokenAccount: kartTokenAccount,
          kartMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [user],
      }),
      program.instruction.upgradeKart({
        accounts: {
          user: user.publicKey,
          poolAccount,
          kartAccount,
          stakingAccount,
          kartTokenAccount: kartTokenAccount,
          poolSolr,
          solrMint,
          userSolr: userSolrTokenAccount,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [user],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [user])
    await provider.connection.confirmTransaction(signature)

    const kartInfo = await getKartAccountInfo(program, kartAccount)

    expect(kartInfo.bump).to.equals(kartAccountBump)
    expect(kartInfo.kartMint.toBase58()).to.equals(
      kartMintAccount.publicKey.toBase58(),
    )

    expect(kartInfo.kartMetadataAccount.toBase58()).to.equals(
      metadataAccount.publicKey.toBase58(),
    )
    expect(kartInfo.kartMasterEdition.toBase58()).to.equals(
      masterEdition.publicKey.toBase58(),
    )

    userSolrTokenAccountInfo = await getTokenAccount(
      provider,
      userSolrTokenAccount,
    )
    expect(userSolrTokenAccountInfo.amount).to.be.bignumber.eq('0')
  })

  it('allow user to upgrade kart by second  garage', async () => {
    // use second staker kart
    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        garage2MintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const [kartAccount] = await getKartAccount(
      program,
      poolName,
      kartMintAccount,
    )

    await solrMintAccount.mintTo(
      userSolrTokenAccount,
      provider.wallet.publicKey,
      [],
      updatedFee.toNumber(),
    )

    const {
      totalDistribution: prevTotalDistribution,
    } = await program.account.poolAccount.fetch(poolAccount)
    await program.rpc.upgradeKart({
      accounts: {
        user: user.publicKey,
        poolAccount,
        kartAccount,
        stakingAccount,
        kartTokenAccount,
        poolSolr,
        userSolr: userSolrTokenAccount,
        solrMint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [user],
    })

    const kartInfo = await getKartAccountInfo(program, kartAccount)
    // TODO: random value
    expect(kartInfo.maxSpeed).to.be.bignumber.equals('2')
    expect(kartInfo.acceleration).to.be.bignumber.equals('50')
    expect(kartInfo.driftPowerConsumptionRate).equals(0.04)
    expect(kartInfo.driftPowerGenerationRate).equals(0.04)
    expect(kartInfo.handling).to.be.bignumber.equals('20')

    let userSolrTokenAccountInfo = await getTokenAccount(
      provider,
      userSolrTokenAccount,
    )

    expect(userSolrTokenAccountInfo.amount).to.be.bignumber.eq('0')
    const { totalDistribution } = await getPoolAccountInfo(program, poolAccount)

    expect(totalDistribution).to.be.bignumber.eq(
      prevTotalDistribution.add(updatedFee),
    )
  })

  let staker1PendingReward: anchor.BN
  it('unstake user token', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    const { globalRewardIndex: prevGlobalReward } = await getPoolAccountInfo(
      program,
      poolAccount,
    )

    const {
      rewardIndex: prevRewardIndex,
      pendingReward: prevPendingReward,
    } = await getStakingAccountInfo(program, stakingAccount)

    await program.rpc.unBond({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        garageTokenAccount,
        systemProgram: SystemProgram.programId,
      },
      signers: [staker],
    })

    const stakerInfo = await getStakingAccountInfo(program, stakingAccount)
    const poolInfo = await getPoolAccountInfo(program, poolAccount)
    const newReward = poolInfo.globalRewardIndex - prevRewardIndex
    // TODO: update pool info
    expect(poolInfo.globalRewardIndex).greaterThan(prevGlobalReward)
    expect(poolInfo.totalStaked).to.be.bignumber.equals(new BN(1))

    expect(stakerInfo.pendingReward).to.be.bignumber.greaterThan('0')
    expect(stakerInfo.pendingReward).to.be.bignumber.equals(
      prevPendingReward.add(new BN(newReward)),
    )
    expect(stakerInfo.rewardIndex).to.equals(poolInfo.globalRewardIndex)
    expect(stakerInfo.isBond).to.be.false

    staker1PendingReward = stakerInfo.pendingReward
  })

  it('not allow user to staker other user staking account', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    try {
      await program.rpc.bond({
        accounts: {
          user: staker2.publicKey,
          poolAccount,
          stakingAccount,
          garageTokenAccount: garage2TokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker2],
      })

      expect.fail('should not pass')
    } catch (e) {
      expect(e.message).to.eq('6002: Invalid mint')
    }
  })

  it('allow user to restake', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    await program.rpc.bond({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        garageTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [staker],
    })

    const stakerInfo = await getStakingAccountInfo(program, stakingAccount)

    expect(stakerInfo.pendingReward).to.be.bignumber.equals(
      staker1PendingReward,
    )
    expect(stakerInfo.isBond).to.be.true
  })

  it('not allow user to withdraw from other staking account', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )
    const staker2TokenAccount = await createTokenAccount(
      provider,
      solrMint,
      staker2.publicKey,
    )
    try {
      await program.rpc.withdraw({
        accounts: {
          user: staker.publicKey,
          poolAccount,
          stakingAccount,
          poolSolr,
          garageTokenAccount,
          solrMint,
          userSolr: staker2TokenAccount,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [staker],
      })
      expect.fail('should not be reach')
    } catch (e) {}
  })
  it('withdraw', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    const stakerTokenAccount = await createTokenAccount(
      provider,
      solrMint,
      staker.publicKey,
    )

    await program.rpc.withdraw({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        poolSolr,
        garageTokenAccount,
        solrMint,
        userSolr: stakerTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [staker],
    })

    const stakerAccountInfo = await getTokenAccount(
      provider,
      stakerTokenAccount,
    )

    expect(stakerAccountInfo.amount).to.be.bignumber.greaterThan(new BN(0))

    const stakingAccountInfo = await getStakingAccountInfo(
      program,
      stakingAccount,
    )

    expect(stakingAccountInfo.pendingReward).to.be.bignumber.eq(new BN(0))
  })

  it('allow transferred nft to be staked', async () => {
    const [stakingAccount] = await getStakingAccount(
      program,
      poolName,
      garageMintAccount,
    )

    await program.rpc.unBond({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        garageTokenAccount,
        systemProgram: SystemProgram.programId,
      },
      signers: [staker],
    })

    const garageTokenAccountOfStaker2 = await createTokenAccount(
      provider,
      garageMintAccount.publicKey,
      staker2.publicKey,
    )

    const tx = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        garageTokenAccount,
        garageTokenAccountOfStaker2,
        staker.publicKey,
        [],
        1,
      ),
    )

    await provider.send(tx, [staker])
    const { amount: balance1 } = await getTokenAccount(
      provider,
      garageTokenAccount,
    )
    const { amount: balance2 } = await getTokenAccount(
      provider,
      garageTokenAccountOfStaker2,
    )
    expect(balance1).to.be.bignumber.eq('0')
    expect(balance2).to.be.bignumber.eq('1')

    let { isBond } = await program.account.stakingAccount.fetch(stakingAccount)
    expect(isBond).to.be.false

    await program.rpc.bond({
      accounts: {
        user: staker2.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        garageTokenAccount: garageTokenAccountOfStaker2,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [staker2],
    })
    ;({ isBond } = await program.account.stakingAccount.fetch(stakingAccount))
    expect(isBond).to.be.true
  })
  const lateStaker = anchor.web3.Keypair.generate()
  it('not distribute reward if distribution period is end', async () => {
    if (Date.now() < endTime.toNumber() * 1000 + 1000) {
      await sleep(endTime.toNumber() * 1000 - Date.now() + 4000)
    }

    // request sol
    await requestAirdrop(provider, lateStaker.publicKey)

    // create nft
    const {
      mint: lateStakerNftMintAccount,
      tokenAccount: lateStakerNftTokenAccount,
    } = await mockCreateAndMintNFT(provider, lateStaker.publicKey)

    const [stakingAccount, stakingAccountBump] = await getStakingAccount(
      program,
      poolName,
      lateStakerNftMintAccount,
    )

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const instructions = [
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user: lateStaker.publicKey,
          poolAccount,
          stakingAccount,
          solrMint,
          garageMint: lateStakerNftMintAccount.publicKey,
          garageTokenAccount: lateStakerNftTokenAccount,
          garageMetadataAccount: metadataAccount.publicKey,
          creatureEdition: masterEdition.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [lateStaker],
      }),
      program.instruction.bond({
        accounts: {
          user: lateStaker.publicKey,
          poolAccount,
          stakingAccount,
          garageTokenAccount: lateStakerNftTokenAccount,
          solrMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [lateStaker],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [lateStaker])
    await provider.connection.confirmTransaction(signature)

    const poolAccountInfo = await getPoolAccountInfo(program, poolAccount)

    const lateStakerStakingAccountInfo = await getStakingAccountInfo(
      program,
      stakingAccount,
    )

    expect(lateStakerStakingAccountInfo.isBond).to.be.true

    expect(lateStakerStakingAccountInfo.pendingReward).to.be.bignumber.equals(
      new BN(0),
    )

    expect(lateStakerStakingAccountInfo.rewardIndex).to.equals(
      poolAccountInfo.globalRewardIndex,
    )
  })
})
