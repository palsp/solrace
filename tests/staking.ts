import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { CandyMachine } from '../target/types/candy_machine'
import { SolRaceStaking } from '../target/types/sol_race_staking'
import { createMint, createTokenAccount, getTokenAccount, sleep } from './utils'
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { expect } from 'chai'
import faker from 'faker'

const BN = anchor.BN

import chai from 'chai'
import CBN from 'chai-bn'
import CAP from 'chai-as-promised'
import { bond, getMasterEdition, getMetadata, unbond } from './utils/services'

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

    // TODO: not mock garage creator
    const garageCreator = anchor.web3.Keypair.generate()

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
          solrMint,
          poolSolr,
          garageCreator: garageCreator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      },
    )

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

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
  })

  let nftMintAccount: Token
  let nftTokenAccount: anchor.web3.PublicKey
  const staker = anchor.web3.Keypair.generate()
  it('stake user token', async () => {
    const startStakingTime = new anchor.BN(Date.now() / 1000)
    // request sol
    const tx = await provider.connection.requestAirdrop(
      staker.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    nftMintAccount = await createMint(provider, 0)
    nftTokenAccount = await createTokenAccount(
      provider,
      nftMintAccount.publicKey,
      staker.publicKey,
    )
    await nftMintAccount.mintTo(
      nftTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    const [stakingAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        // TODO: delete poolName
        Buffer.from(poolName),
        staker.publicKey.toBuffer(),
        nftTokenAccount.toBuffer(),
      ],
      program.programId,
    )

    //   // try {
    //   //   let stakingAccInfo = await provider.connection.getAccountInfo(
    //   //     stakingAccount,
    //   //   )

    //   //   console.log('before Initialize ', stakingAccInfo.data)
    //   // } catch (e) {}

    const [poolAccount] = await bond({
      program,
      user: staker.publicKey,
      solrMint,
      signers: [staker],
      poolName,
      garageMint: nftMintAccount.publicKey,
      garageTokenAccount: nftTokenAccount,
    })

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

  let anotherNftMintAccount: Token
  let anotherNftTokenAccount: anchor.web3.PublicKey
  let anotherStaker = anchor.web3.Keypair.generate()
  it('stake another user token', async () => {
    if (Date.now() < elapseTime.toNumber() * 1000 + 1000) {
      await sleep(elapseTime.toNumber() * 1000 - Date.now() + 4000)
    }
    // request airdrop
    const tx = await provider.connection.requestAirdrop(
      anotherStaker.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    anotherNftMintAccount = await createMint(provider, 0)
    anotherNftTokenAccount = await createTokenAccount(
      provider,
      anotherNftMintAccount.publicKey,
      anotherStaker.publicKey,
    )
    await anotherNftMintAccount.mintTo(
      anotherNftTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )
    const {
      lastDistributed: prevLatestDistribution,
      globalRewardIndex: prevGlobalRewardIndex,
    } = await program.account.poolAccount.fetch(poolAccount)

    const [_, anotherStakingAccount] = await bond({
      program,
      user: anotherStaker.publicKey,
      solrMint,
      garageMint: anotherNftMintAccount.publicKey,
      garageTokenAccount: anotherNftTokenAccount,
      signers: [anotherStaker],
      poolName,
    })

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(2))

    const anotherStakerAccountInfo = await program.account.stakingAccount.fetch(
      anotherStakingAccount,
    )

    expect(anotherStakerAccountInfo.isBond).to.be.true

    console.log(poolAccountInfo)

    // expect(poolAccountInfo.globalRewardIndex).to.be.bignumber.equals(
    //   anotherStakerAccountInfo.rewardIndex,
    // )

    // distribution amount matter
    // expect(anotherStakerAccountInfo.pendingReward).to.be.a.bignumber.equals(
    //   new BN(0),
    // )

    // it's update latest distribution time
    // expect(poolAccountInfo.lastDistributed).to.be.bignumber.greaterThan(
    //   prevLatestDistribution,
    // )
    // console.log('prev gri', prevGlobalRewardIndex)
    // console.log('new', poolAccountInfo.globalRewardIndex)
    // it's update global reward index
    // expect(
    //   poolAccountInfo.globalRewardIndex,
    // ).to.be.bignumber.greaterThanOrEqual(prevGlobalRewardIndex)
  })

  // it('unstake user token', async () => {
  //   if (Date.now() < endTime.toNumber() * 1000 + 1000) {
  //     await sleep(endTime.toNumber() * 1000 - Date.now() + 4000)
  //   }

  //   await unbond({
  //     program,
  //     poolName,
  //     user: staker.publicKey,
  //     garageTokenAccount: nftTokenAccount,
  //     solrMint,
  //     signers: [staker],
  //   })
  // })

  // it('unstake another user token', async () => {
  //   if (Date.now() < endTime.toNumber() * 1000 + 1000) {
  //     await sleep(endTime.toNumber() * 1000 - Date.now() + 4000)
  //   }

  //   await unbond({
  //     program,
  //     poolName,
  //     user: anotherStaker.publicKey,
  //     garageTokenAccount: anotherNftTokenAccount,
  //     solrMint,
  //     signers: [anotherStaker],
  //   })
  // })

  // // it('update pool account correctly', async () => {})

  // const lateStaker = anchor.web3.Keypair.generate()
  // it('not distribute reward if distribution period is end', async () => {
  //   const startStakingTime = new anchor.BN(Date.now() / 1000)
  //   // request sol
  //   const tx = await provider.connection.requestAirdrop(
  //     lateStaker.publicKey,
  //     100000000000,
  //   )
  //   await provider.connection.confirmTransaction(tx)

  //   // create nft
  //   const lateStakerNftMintAccount = await createMint(provider, 0)
  //   const lateStakerNftTokenAccount = await createTokenAccount(
  //     provider,
  //     lateStakerNftMintAccount.publicKey,
  //     lateStaker.publicKey,
  //   )
  //   await lateStakerNftMintAccount.mintTo(
  //     lateStakerNftTokenAccount,
  //     provider.wallet.publicKey,
  //     [],
  //     1,
  //   )
  //   const [poolAccount, lateStakerStakingAccount] = await bond({
  //     program,
  //     user: lateStaker.publicKey,
  //     garageTokenAccount: lateStakerNftTokenAccount,
  //     solrMint,
  //     signers: [lateStaker],
  //     poolName,
  //   })

  //   const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

  //   const lateStakerStakingAccountInfo = await program.account.stakingAccount.fetch(
  //     lateStakerStakingAccount,
  //   )

  //   expect(lateStakerStakingAccountInfo.isBond).to.be.true

  //   expect(lateStakerStakingAccountInfo.pendingReward).to.be.bignumber.equals(
  //     new BN(0),
  //   )

  //   expect(lateStakerStakingAccountInfo.rewardIndex).to.be.bignumber.equals(
  //     poolAccountInfo.globalRewardIndex,
  //   )

  //   console.log(
  //     'global reward Index : ',
  //     poolAccountInfo.globalRewardIndex.toString(),
  //   )
  // })
})
