import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { getTokenAccount } from "@project-serum/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { toast } from "react-toastify";
import { api } from "~/api";
import {
  SOL_RACE_CORE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "~/api/solana/addresses";
import { IDL, SolRaceCore } from "~/api/solana/types/sol_race_core";
import {
  getMetadata,
  getMasterEdition,
  getAtaForMint,
} from "~/api/solana/utils";
interface UpgradeKart {
  provider: anchor.Provider;
  poolAccount: PublicKey;
  kartMint: PublicKey;
  kartAccount: PublicKey;
  kartAccountBump: number;
  kartTokenAccount: PublicKey;
  stakingAccount: PublicKey;
  solrMint: PublicKey;
  poolSolr: PublicKey;
  isInitialize: boolean;
}

export const upgradeKart = async ({
  provider,
  kartMint,
  poolAccount,
  kartAccount,
  kartAccountBump,
  kartTokenAccount,
  poolSolr,
  solrMint,
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

  const [ata] = await getAtaForMint(solrMint, provider.wallet.publicKey);
  let isInitializedATA = false;
  try {
    const ataInfo = await getTokenAccount(provider, ata);
    isInitializedATA = ataInfo.isInitialized;
  } catch (e) {
    isInitializedATA = false;
  }

  if (!isInitializedATA) {
    throw new Error("Do not have SOLR");
  }

  transaction.add(
    program.instruction.upgradeKart({
      accounts: {
        user: provider.wallet.publicKey,
        poolAccount,
        kartAccount,
        stakingAccount,
        kartTokenAccount,
        poolSolr,
        userSolr: ata,
        solrMint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    })
  );

  return provider.send(transaction);
};

export const updateKartOwner = async (publicAddress: string) => {
  const { data } = await api.put(`/kart/refresh/${publicAddress}`);

  return data;
};
