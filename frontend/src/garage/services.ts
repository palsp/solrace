import * as anchor from '@project-serum/anchor'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import {
  CIVIC,
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from '~/api/solana/addresses'
import {
  CandyMachineAccount,
  getCandyMachineCreator,
} from '~/api/solana/candy-machine'
import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
  getNetworkExpire,
  getNetworkToken,
  getMasterEdition,
  getMetadata,
} from '~/api/solana/utils'

import { SolRaceCore, IDL } from '~/api/solana/types/sol_race_core'

type Bond = {
  provider: anchor.Provider
  poolAccount: PublicKey
  user: PublicKey
  solrMint: PublicKey
  nftMint: PublicKey
  nftTokenAccount: PublicKey
  stakingAccount: PublicKey
  stakingAccountBump: number
  isInitialized: boolean
}

type UnBond = {
  provider: anchor.Provider
  poolAccount: PublicKey
  user: PublicKey
  stakingAccount: PublicKey
  solrMint: PublicKey
}

type Mint = {
  provider: anchor.Provider
  candyMachine: CandyMachineAccount
}

export const mint = async ({ provider, candyMachine }: Mint) => {
  const payer = provider.wallet.publicKey
  const mint = anchor.web3.Keypair.generate()

  const [userTokenAccount] = await getAtaForMint(mint.publicKey, payer)

  const userPayingAccount = candyMachine.state.tokenMint
    ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
    : provider.wallet.publicKey

  const candyMachineAddress = candyMachine.id
  const remainingAccounts = []
  const signers: anchor.web3.Keypair[] = [mint]
  const cleanupInstructions = []
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer,
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccount,
      payer,
      payer,
      mint.publicKey,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccount,
      payer,
      [],
      1,
    ),
  ]

  if (candyMachine.state.gatekeeper) {
    remainingAccounts.push({
      pubkey: (
        await getNetworkToken(
          payer,
          candyMachine.state.gatekeeper.gatekeeperNetwork,
        )
      )[0],
      isWritable: true,
      isSigner: false,
    })
    if (candyMachine.state.gatekeeper.expireOnUse) {
      remainingAccounts.push({
        pubkey: CIVIC,
        isWritable: false,
        isSigner: false,
      })
      remainingAccounts.push({
        pubkey: (
          await getNetworkExpire(
            candyMachine.state.gatekeeper.gatekeeperNetwork,
          )
        )[0],
        isWritable: false,
        isSigner: false,
      })
    }
  }
  if (candyMachine.state.whitelistMintSettings) {
    const mint = new anchor.web3.PublicKey(
      candyMachine.state.whitelistMintSettings.mint,
    )

    const whitelistToken = (await getAtaForMint(mint, payer))[0]
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    })

    if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
      const whitelistBurnAuthority = anchor.web3.Keypair.generate()

      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      })
      remainingAccounts.push({
        pubkey: whitelistBurnAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      })
      signers.push(whitelistBurnAuthority)
      const exists = await candyMachine.program.provider.connection.getAccountInfo(
        whitelistToken,
      )
      if (exists) {
        instructions.push(
          Token.createApproveInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            whitelistBurnAuthority.publicKey,
            payer,
            [],
            1,
          ),
        )
        cleanupInstructions.push(
          Token.createRevokeInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            payer,
            [],
          ),
        )
      }
    }
  }

  if (candyMachine.state.tokenMint) {
    const transferAuthority = anchor.web3.Keypair.generate()

    signers.push(transferAuthority)
    remainingAccounts.push({
      pubkey: userTokenAccount,
      isWritable: true,
      isSigner: false,
    })
    remainingAccounts.push({
      pubkey: transferAuthority.publicKey,
      isWritable: false,
      isSigner: true,
    })

    instructions.push(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccount,
        transferAuthority.publicKey,
        payer,
        [],
        candyMachine.state.price.toNumber(),
      ),
    )
    cleanupInstructions.push(
      Token.createRevokeInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccount,
        payer,
        [],
      ),
    )
  }

  const metadataAddress = await getMetadata(mint.publicKey)
  const masterEdition = await getMasterEdition(mint.publicKey)

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress,
  )

  instructions.push(
    candyMachine.program.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: payer,
        wallet: candyMachine.state.treasury,
        mint: mint.publicKey,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: payer,
        updateAuthority: payer,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
    }),
  )

  const tx = new Transaction({
    feePayer: provider.wallet.publicKey,
  })
  instructions.forEach((instruction) => tx.add(instruction))
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash(provider.connection.commitment)
  ).blockhash
  tx.partialSign(...signers)

  const cleanUpTx = new Transaction({
    feePayer: provider.wallet.publicKey,
  })
  cleanupInstructions.forEach((instruction) => cleanUpTx.add(instruction))
  cleanUpTx.recentBlockhash = (
    await provider.connection.getLatestBlockhash(provider.connection.commitment)
  ).blockhash

  return provider.sendAll([
    { tx, signers },
    { tx: cleanUpTx, signers: [] },
  ])
}

export const bond = async ({
  provider,
  user,
  poolAccount,
  solrMint,
  nftMint,
  nftTokenAccount,
  stakingAccount,
  stakingAccountBump,
  isInitialized,
}: Bond) => {
  const program = new anchor.Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
  )

  const transaction = new anchor.web3.Transaction()

  if (!isInitialized) {
    const garageMetadataAccount = await getMetadata(nftMint)
    const creatureEdition = await getMasterEdition(nftMint)
    transaction.add(
      program.instruction.initStake(stakingAccountBump, {
        accounts: {
          user,
          poolAccount,
          stakingAccount: stakingAccount,
          solrMint,
          garageMint: nftMint,
          garageTokenAccount: nftTokenAccount,
          garageMetadataAccount,
          creatureEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
      }),
    )
  } else {
    console.log('already initialize skip ')
  }

  transaction.add(
    program.instruction.bond({
      accounts: {
        user,
        poolAccount,
        stakingAccount: stakingAccount,
        solrMint,
        systemProgram: SystemProgram.programId,
      },
    }),
  )
  return provider.send(transaction)
}

export const unBond = async ({
  provider,
  poolAccount,
  user,
  stakingAccount,
  solrMint,
}: UnBond) => {
  const program = new anchor.Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider,
  )

  return program.rpc.unBond({
    accounts: {
      user,
      poolAccount,
      stakingAccount,
      solrMint,
      systemProgram: SystemProgram.programId,
    },
  })
}
