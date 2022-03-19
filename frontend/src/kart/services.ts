import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { api } from "~/api";
import {
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "~/api/solana/addresses";
import { IDL, SolRaceCore } from "~/api/solana/types/sol_race_core";
import { getMetadata, getMasterEdition } from "~/api/solana/utils";
interface UpgradeKart {
  provider: anchor.Provider;
  poolAccount: PublicKey;
  kartMint: PublicKey;
  kartAccount: PublicKey;
  kartAccountBump: number;
  kartTokenAccount: PublicKey;
  stakingAccount: PublicKey;
  // kartMetadataAccount: PublicKey,
  // creatureEdition: PublicKey,
  isInitialize: boolean;
}

export const upgradeKart = async ({
  provider,
  kartMint,
  poolAccount,
  kartAccount,
  kartAccountBump,
  kartTokenAccount,
  stakingAccount,
  isInitialize,
}: UpgradeKart) => {
  const program = new Program<SolRaceCore>(
    IDL,
    SOL_RACE_CORE_PROGRAM_ID,
    provider
  );
  const transaction = new Transaction();

  if (!isInitialize) {
    const kartMetadataAccount = await getMetadata(kartMint);
    const creatureEdition = await getMasterEdition(kartMint);
    transaction.add(
      program.instruction.initKart(kartAccountBump, {
        accounts: {
          user: provider.wallet.publicKey,
          poolAccount,
          kartAccount,
          kartMint,
          kartTokenAccount,
          kartMetadataAccount,
          creatureEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      })
    );
  }

  transaction.add(
    program.instruction.upgradeKart({
      accounts: {
        user: provider.wallet.publicKey,
        poolAccount,
        kartAccount,
        stakingAccount,
        kartTokenAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    })
  );

  return provider.send(transaction);
};

export const updateKartOwner = async (publicAddress: string) => {
  const { data } = await api.put(`/kart/refresh/${publicAddress}`);

  return data;
};
