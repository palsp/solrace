import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "~/api/solana/addresses";
import { getMasterEdition, getMetadata } from "~/api/solana/utils";
import { SolRaceCore, IDL } from "~/api/solana/types/sol_race_core";

type Bond = {
  provider: anchor.Provider;
  poolAccount: PublicKey;
  user: PublicKey;
  solrMint: PublicKey;
  nftMint: PublicKey;
  nftTokenAccount: PublicKey;
  stakingAccount: PublicKey;
  stakingAccountBump: number;
  isInitialized: boolean;
};

type UnBond = {
  provider: anchor.Provider;
  poolAccount: PublicKey;
  user: PublicKey;
  stakingAccount: PublicKey;
  solrMint: PublicKey;
  tokenAccount: PublicKey;
};

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
    provider
  );

  const transaction = new anchor.web3.Transaction();

  if (!isInitialized) {
    const garageMetadataAccount = await getMetadata(nftMint);
    const creatureEdition = await getMasterEdition(nftMint);
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
      })
    );
  } else {
    console.log("already initialize skip ");
  }

  transaction.add(
    program.instruction.bond({
      accounts: {
        user,
        poolAccount,
        stakingAccount: stakingAccount,
        garageTokenAccount: nftTokenAccount,
        solrMint,
        systemProgram: SystemProgram.programId,
      },
    })
  );
  return provider.send(transaction);
};

export const unBond = async ({
  provider,
  poolAccount,
  user,
  stakingAccount,
  tokenAccount,
  solrMint,
}: UnBond) => {
  const program = new anchor.Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider
  );

  return program.rpc.unBond({
    accounts: {
      user,
      poolAccount,
      stakingAccount,
      solrMint,
      garageTokenAccount: tokenAccount,
      systemProgram: SystemProgram.programId,
    },
  });
};
