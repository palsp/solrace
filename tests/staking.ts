import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SolRaceStaking } from '../target/types/sol_race_staking'
import { createMint, createTokenAccount, getTokenAccount, sleep } from './utils'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { expect } from 'chai'
import faker from 'faker'

const BN = anchor.BN

import chai from 'chai'
import CBN from 'chai-bn'
import CAP from 'chai-as-promised'
import { SystemProgram, Transaction } from '@solana/web3.js'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

chai.use(CAP).use(CBN(BN)).should()

type PublicKey = anchor.web3.PublicKey

function PoolBumps() {
  this.poolAccount
  this.poolSolr
}

describe('sol_race_staking', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.SolRaceStaking as Program<SolRaceStaking>

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
  let endTime = startTime.add(new anchor.BN(15))

  const time = endTime.sub(startTime)

  const distributedPerSec = solrAmount.div(time)

  console.log(`distribute ${distributedPerSec} solr per sec`)
  it('initialize pool', async () => {
    let bumps = new PoolBumps()

    let [
      poolAccount,
      poolAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    let [
      poolSolr,
      poolSolrBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_solr')],
      program.programId,
    )

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

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    expect(poolAccountInfo.startTime).to.be.bignumber.equals(startTime)
    expect(poolAccountInfo.endTime).to.be.bignumber.equals(endTime)

    expect(poolAccountInfo.poolAuthority.equals(poolAuthority)).to.be.true
    // TODO: check nft creator
    expect(poolAccountInfo.stakingAuthority.equals(provider.wallet.publicKey))
      .to.be.true

    expect(poolAccountInfo.solrMint.equals(solrMint)).to.be.true
    expect(poolAccountInfo.poolSolr.equals(poolSolr)).to.be.true
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

    expect(poolAccountInfo.garageCreator.equals(garageCreator.publicKey)).to.be
      .true

    expect(poolAccountInfo.kartCreator.equals(kartCreator.publicKey)).to.be.true

    expect(poolAccountInfo.solrMint.equals(solrMint)).to.be.true
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

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    const [
      stakingAccount,
      stakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker.publicKey.toBuffer(),
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
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [staker],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [staker])
    await provider.connection.confirmTransaction(signature)

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)
    const stakingAccountInfo = await program.account.stakingAccount.fetch(
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

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    const {
      lastDistributed: prevLastDistributed,
    } = await program.account.poolAccount.fetch(poolAccount)

    const [
      stakingAccount,
      stakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker2.publicKey.toBuffer(),
        garage2MintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )
    // mock
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
  let kartMintAccount: Token
  let kartTokenAccount: PublicKey
  it('allow user to upgrade kart by first  garage', async () => {
    // request sol
    const tx = await provider.connection.requestAirdrop(
      user.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    kartMintAccount = await createMint(provider, 0)
    kartTokenAccount = await createTokenAccount(
      provider,
      kartMintAccount.publicKey,
      user.publicKey,
    )
    await kartMintAccount.mintTo(
      kartTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    // mock
    const metadataAccount = anchor.web3.Keypair.generate()
    const masterEdition = anchor.web3.Keypair.generate()

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    // use first staker kart
    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker.publicKey.toBuffer(),
        garageMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const [
      kartAccount,
      kartAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('kart_account'),
        Buffer.from(poolName),
        user.publicKey.toBuffer(),
        kartMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
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
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [user],
      }),
    ]

    const transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))

    const signature = await provider.send(transaction, [user])
    await provider.connection.confirmTransaction(signature)

    const kartInfo = await program.account.kartAccount.fetch(kartAccount)
    expect(kartInfo.bump).to.equals(kartAccountBump)
    expect(kartInfo.owner.toBase58()).to.equals(user.publicKey.toBase58())
    expect(kartInfo.kartMint.toBase58()).to.equals(
      kartMintAccount.publicKey.toBase58(),
    )
    expect(kartInfo.kartTokenAccount.toBase58()).to.equals(
      kartTokenAccount.toBase58(),
    )
    expect(kartInfo.kartMetadataAccount.toBase58()).to.equals(
      metadataAccount.publicKey.toBase58(),
    )
    expect(kartInfo.kartMasterEdition.toBase58()).to.equals(
      masterEdition.publicKey.toBase58(),
    )
  })

  it('allow user to upgrade kart by second  garage', async () => {
    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )
    // use second staker kart
    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker2.publicKey.toBuffer(),
        garage2MintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const [kartAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('kart_account'),
        Buffer.from(poolName),
        user.publicKey.toBuffer(),
        kartMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )
    await program.rpc.upgradeKart({
      accounts: {
        user: user.publicKey,
        poolAccount,
        kartAccount,
        stakingAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [user],
    })

    const kartInfo = await program.account.kartAccount.fetch(kartAccount)
    // TODO: random value
    expect(kartInfo.maxSpeed).to.be.bignumber.equals('2')
    expect(kartInfo.acceleration).to.be.bignumber.equals('2')
    expect(kartInfo.driftPowerConsumptionRate).to.be.bignumber.equals('2')
    expect(kartInfo.driftPowerGenerationRate).to.be.bignumber.equals('2')
    expect(kartInfo.handling).to.be.bignumber.equals('2')
  })

  let staker1PendingReward: anchor.BN
  it('unstake user token', async () => {
    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker.publicKey.toBuffer(),
        garageMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    await program.rpc.unBond({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        systemProgram: SystemProgram.programId,
      },
      signers: [staker],
    })

    const stakerInfo = await program.account.stakingAccount.fetch(
      stakingAccount,
    )
    const poolInfo = await program.account.poolAccount.fetch(poolAccount)

    // update pool info
    expect(poolInfo.totalStaked).to.be.bignumber.equals(new BN(1))

    expect(stakerInfo.rewardIndex).to.equals(poolInfo.globalRewardIndex)
    expect(stakerInfo.isBond).to.be.false

    staker1PendingReward = stakerInfo.pendingReward
  })

  it('allow user to restake', async () => {
    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker.publicKey.toBuffer(),
        garageMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    await program.rpc.bond({
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount,
        solrMint,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [staker],
    })

    const stakerInfo = await program.account.stakingAccount.fetch(
      stakingAccount,
    )

    expect(stakerInfo.pendingReward).to.be.bignumber.equals(
      staker1PendingReward,
    )
    expect(stakerInfo.isBond).to.be.true
  })

  const lateStaker = anchor.web3.Keypair.generate()
  it('not distribute reward if distribution period is end', async () => {
    if (Date.now() < endTime.toNumber() * 1000 + 1000) {
      await sleep(endTime.toNumber() * 1000 - Date.now() + 4000)
    }

    // request sol
    const tx = await provider.connection.requestAirdrop(
      lateStaker.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    const lateStakerNftMintAccount = await createMint(provider, 0)
    const lateStakerNftTokenAccount = await createTokenAccount(
      provider,
      lateStakerNftMintAccount.publicKey,
      lateStaker.publicKey,
    )
    await lateStakerNftMintAccount.mintTo(
      lateStakerNftTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )
    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    const [
      stakingAccount,
      stakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        lateStaker.publicKey.toBuffer(),
        lateStakerNftMintAccount.publicKey.toBuffer(),
      ],
      program.programId,
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

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    const lateStakerStakingAccountInfo = await program.account.stakingAccount.fetch(
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
