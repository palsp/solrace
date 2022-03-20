import _ from "lodash";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { SolRaceCore } from "~/api/solana/types/sol_race_core";

interface KartInfo {
  kartMint: PublicKey;
  kartMetadataAccount: PublicKey;
  kartMasterEdition: PublicKey;
  maxSpeed: number;
  acceleration: number;
  driftPowerGenerationRate: number;
  driftPowerConsumptionRate: number;
  handling: number;
}

type FetchKartInfo = {
  program: Program<SolRaceCore>;
  poolName: string;
  kartMint: PublicKey;
};

export const fetchKartInfo = async ({
  program,
  poolName,
  kartMint,
}: FetchKartInfo): Promise<[PublicKey, number, KartInfo | undefined]> => {
  const [kartAccount, kartAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from("kart_account"), Buffer.from(poolName), kartMint.toBuffer()],
    program.programId
  );

  try {
    const accountInfo = await program.account.kartAccount.fetch(kartAccount);

    return [kartAccount, kartAccountBump, accountInfo];
  } catch (e) {
    return [kartAccount, kartAccountBump, undefined];
  }
};
