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
  const solrAmount = new anchor.BN(5000000)

  const poolName = faker.company.companyName().slice(0, 10)

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

  let nftMintAccount: Token
  let nftTokenAccount: PublicKey
  let staker = anchor.web3.Keypair.generate()
  it('stake user token', async () => {
    const tx = await provider.connection.requestAirdrop(
      staker.publicKey,
      100000000000,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    await provider.connection.confirmTransaction(tx)
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

    const [
      stakingAccount,
      stakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        staker.publicKey.toBuffer(),
        nftTokenAccount.toBuffer(),
      ],
      program.programId,
    )

    await program.rpc.stake(stakingAccountBump, {
      accounts: {
        user: staker.publicKey,
        poolAccount,
        stakingAccount: stakingAccount,
        solrMint,
        garageTokenAccount: nftTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [staker],
    })

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(1))
    console.log('starTime:', poolAccountInfo.startTime.toString())
    console.log('endTime:', poolAccountInfo.endTime.toString())
  })

  let anotherStaker = anchor.web3.Keypair.generate()
  it('stake another user token', async () => {
    const tx = await provider.connection.requestAirdrop(
      anotherStaker.publicKey,
      100000000000,
    )

    const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(poolName), Buffer.from('pool_account')],
      program.programId,
    )

    await provider.connection.confirmTransaction(tx)
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

    const [
      anotherStakingAccount,
      anotherStakingAccountBump,
    ] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('staking_account'),
        anotherStaker.publicKey.toBuffer(),
        nftTokenAccount.toBuffer(),
      ],
      program.programId,
    )

    await program.rpc.stake(anotherStakingAccountBump, {
      accounts: {
        user: anotherStaker.publicKey,
        poolAccount,
        stakingAccount: anotherStakingAccount,
        solrMint,
        garageTokenAccount: nftTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [anotherStaker],
    })

    const poolAccountInfo = await program.account.poolAccount.fetch(poolAccount)

    // console.log(poolAccountInfo)
    expect(poolAccountInfo.totalStaked).to.be.bignumber.equals(new BN(2))
    console.log(
      'totalDistribution: ',
      poolAccountInfo.totalDistribution.toString(),
    )
    console.log(
      'globalRewardIndex: ',
      poolAccountInfo.globalRewardIndex.toString(),
    )

    const anotherStakerAccountInfo = await program.account.stakingAccount.fetch(
      anotherStakingAccount,
    )

    expect(poolAccountInfo.globalRewardIndex).to.be.bignumber.equals(
      anotherStakerAccountInfo.rewardIndex,
    )
  })
})
