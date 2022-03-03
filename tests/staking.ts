import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { CandyMachine } from '../target/types/candy_machine'
import { SolRaceStaking } from '../target/types/sol_race_staking'
import { createMint, createTokenAccount, getTokenAccount } from './utils'
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
import { stake } from './utils/services'

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

  // @ts-ignore
  const program = anchor.workspace.SolRaceStaking as Program<SolRaceStaking>

  // All mints default to 6 decimal places.
  // solr to be distributed
  // ~ 0.06 solr pere sec
  const solrAmount = new anchor.BN(0.9)

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
          solrMint,
          poolSolr,
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
    expect(poolAccountInfo.globalRewardIndex).to.be.a.bignumber.equal(
      new anchor.BN(0),
    )

    expect(poolAccountInfo.startTime).to.be.a.bignumber.equal(startTime)
    expect(poolAccountInfo.endTime).to.be.a.bignumber.equal(endTime)
  })

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
    let nftMintAccount = await createMint(provider, 0)
    let nftTokenAccount = await createTokenAccount(
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

    const [poolAccount, stakingAccount] = await stake({
      program,
      user: staker.publicKey,
      garageTokenAccount: nftTokenAccount,
      solrMint,
      signers: [staker],
      poolName,
    })

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(1))

    expect(poolAccountInfo.lastDistributed).to.be.bignumber.greaterThan(
      new BN(0),
    )
  })

  let anotherStaker = anchor.web3.Keypair.generate()
  it('stake another user token', async () => {
    // request airdrop
    const tx = await provider.connection.requestAirdrop(
      anotherStaker.publicKey,
      100000000000,
    )
    await provider.connection.confirmTransaction(tx)

    // create nft
    let nftMintAccount = await createMint(provider, 0)
    let nftTokenAccount = await createTokenAccount(
      provider,
      nftMintAccount.publicKey,
      anotherStaker.publicKey,
    )
    await nftMintAccount.mintTo(
      nftTokenAccount,
      provider.wallet.publicKey,
      [],
      1,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    const [anotherStakingAccount] = await stake({
      program,
      user: anotherStaker.publicKey,
      garageTokenAccount: nftTokenAccount,
      solrMint,
      signers: [anotherStaker],
      poolName,
    })

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(2))

    const anotherStakerAccountInfo = await program.account.stakingAccount.fetch(
      anotherStakingAccount,
    )

    expect(poolAccountInfo.globalRewardIndex).to.be.bignumber.equals(
      anotherStakerAccountInfo.rewardIndex,
    )

    // distribution amount matter
    expect(anotherStakerAccountInfo.pendingReward).to.be.a.bignumber.equals(
      new BN(0),
    )

    // it's update latest distribution time
    // expect(poolAccountInfo.lastDistributed).to.be.bignumber.greaterThan(
    //   prevLatestDistribution,
    // )
    // it's update global reward index
    // expect(poolAccountInfo.globalRewardIndex).to.be.bignumber.greaterThan(
    //   prevGlobalRewardIndex,
    // )
  })
})
