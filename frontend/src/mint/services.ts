import * as anchor from "@project-serum/anchor";
import { MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Signer,
  SystemProgram,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  CIVIC,
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "~/api/solana/addresses";
import {
  CandyMachineAccount,
  getCandyMachineCreator,
} from "~/api/solana/candy-machine";

import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
  getNetworkExpire,
  getNetworkToken,
  getMasterEdition,
  getMetadata,
} from "~/api/solana/utils";

import { POOL_NAME } from "~/api/solana/constants";
import { IDL, SolRaceCore } from "~/api/solana/types/sol_race_core";

type Mint = {
  provider: anchor.Provider;
  candyMachine: CandyMachineAccount;
};

type Verify = {
  provider: anchor.Provider;

  nftMint: anchor.web3.PublicKey;
  nftTokenAccount: anchor.web3.PublicKey;
};

export const handleMintError = (error: any) => {
  let message = error.msg || "Minting failed! Please try again!";
  if (!error.msg) {
    if (!error.message) {
      message = "Transaction Timeout! Please try again.";
    } else if (error.message.indexOf("0x137") > 0) {
      message = `SOLD OUT!`;
    } else if (error.message.indexOf("0x1778") > 0) {
      message = `Insufficient funds to mint. Please fund your wallet.`;
    }
  } else {
    if (error.code === 311) {
      message = `SOLD OUT!`;
    } else if (error.code === 312) {
      message = `Minting period hasn't started yet.`;
    }
  }

  return message;
};

export const getUserBalance = async (
  user: anchor.web3.PublicKey,
  connection: Connection,
  tokenMint?: anchor.web3.PublicKey
) => {
  if (!tokenMint) {
    const balance = await connection.getBalance(user);

    return [balance.toString(), 9];
  } else {
    const [tokenAccount] = await getAtaForMint(tokenMint, user);

    try {
      const resp = await connection.getTokenAccountBalance(tokenAccount);

      return [resp.value.amount, resp.value.decimals];
    } catch (e) {
      return ["0", 0];
    }
  }
};

const createTransactionFromInstructions = async (
  provider: anchor.Provider,
  instructions: TransactionInstruction[],
  feePayer: PublicKey,
  signers: Signer[] = []
) => {
  const tx = new Transaction({ feePayer });
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash(provider.connection.commitment)
  ).blockhash;
  instructions.forEach((instruction) => tx.add(instruction));
  if (signers.length > 0) {
    tx.partialSign(...signers);
  }

  return tx;
};

export const mint = async ({ provider, candyMachine }: Mint) => {
  const payer = provider.wallet.publicKey;
  const mint = anchor.web3.Keypair.generate();

  const [userTokenAccount] = await getAtaForMint(mint.publicKey, payer);

  const userPayingAccount = candyMachine.state.tokenMint
    ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
    : provider.wallet.publicKey;

  const candyMachineAddress = candyMachine.id;
  const remainingAccounts = [];
  const signers: anchor.web3.Keypair[] = [mint];
  const cleanupInstructions = [];
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccount,
      payer,
      payer,
      mint.publicKey
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccount,
      payer,
      [],
      1
    ),
  ];

  if (candyMachine.state.gatekeeper) {
    remainingAccounts.push({
      pubkey: (
        await getNetworkToken(
          payer,
          candyMachine.state.gatekeeper.gatekeeperNetwork
        )
      )[0],
      isWritable: true,
      isSigner: false,
    });
    if (candyMachine.state.gatekeeper.expireOnUse) {
      remainingAccounts.push({
        pubkey: CIVIC,
        isWritable: false,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: (
          await getNetworkExpire(
            candyMachine.state.gatekeeper.gatekeeperNetwork
          )
        )[0],
        isWritable: false,
        isSigner: false,
      });
    }
  }
  if (candyMachine.state.whitelistMintSettings) {
    const mint = new anchor.web3.PublicKey(
      candyMachine.state.whitelistMintSettings.mint
    );

    const whitelistToken = (await getAtaForMint(mint, payer))[0];
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    });

    if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
      const whitelistBurnAuthority = anchor.web3.Keypair.generate();

      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: whitelistBurnAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      });
      signers.push(whitelistBurnAuthority);
      const exists = await candyMachine.program.provider.connection.getAccountInfo(
        whitelistToken
      );
      if (exists) {
        instructions.push(
          Token.createApproveInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            whitelistBurnAuthority.publicKey,
            payer,
            [],
            1
          )
        );
        cleanupInstructions.push(
          Token.createRevokeInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            payer,
            []
          )
        );
      }
    }
  }

  if (candyMachine.state.tokenMint) {
    const transferAuthority = anchor.web3.Keypair.generate();

    signers.push(transferAuthority);
    remainingAccounts.push({
      pubkey: userTokenAccount,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: transferAuthority.publicKey,
      isWritable: false,
      isSigner: true,
    });

    instructions.push(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccount,
        transferAuthority.publicKey,
        payer,
        [],
        candyMachine.state.price.toNumber()
      )
    );
    cleanupInstructions.push(
      Token.createRevokeInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccount,
        payer,
        []
      )
    );
  }

  const metadataAddress = await getMetadata(mint.publicKey);
  const masterEdition = await getMasterEdition(mint.publicKey);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress
  );

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
    })
  );

  const tx = await createTransactionFromInstructions(
    provider,
    instructions,
    provider.wallet.publicKey,
    signers
  );

  const cleanUpTx = await createTransactionFromInstructions(
    provider,
    cleanupInstructions,
    provider.wallet.publicKey
  );

  return provider.sendAll([
    { tx, signers },
    { tx: cleanUpTx, signers: [] },
  ]);
};

export const verifyNFT = async ({
  provider,
  nftMint,
  nftTokenAccount,
}: Verify) => {
  const program = new anchor.Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider
  );
  const nftMetadataAccount = await getMetadata(nftMint);
  const creatureEdition = await getMasterEdition(nftMint);
  const [poolAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(POOL_NAME), Buffer.from("pool_account")],
    program.programId
  );
  return program.rpc.verify({
    accounts: {
      user: provider.wallet.publicKey,
      garageMint: nftMint,
      garageTokenAccount: nftTokenAccount,
      garageMetadataAccount: nftMetadataAccount,
      creatureEdition,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      poolAccount,
    },
  });
};
