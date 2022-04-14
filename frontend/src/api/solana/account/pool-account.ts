import _ from "lodash";
import { BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolRaceCore } from "~/api/solana/types/sol_race_core";
import { formatTime } from "~/utils/time";

export interface PoolInfo {
  poolName: string;
  poolAuthority: PublicKey;
  garageCreator: PublicKey;
  kartCreator: PublicKey;
  stakingAuthority: PublicKey;
  solrMint: PublicKey;
  poolSolr: PublicKey;
  globalRewardIndex: number;

  startTime: BN;
  endTime: BN;
  lastDistributed: BN;
  totalStaked: BN;
  totalDistribution: BN;
  maxMultiplier: BN;
  multiplierUnit: BN;
}

type FetchPoolInfo = {
  program: Program<SolRaceCore>;
  poolName: string;
};

export const fetchPoolInfo = async ({
  program,
  poolName,
}: FetchPoolInfo): Promise<[PublicKey, number, PoolInfo | undefined]> => {
  const [poolAccount, poolAccountBump] = await PublicKey.findProgramAddress(
    [Buffer.from(poolName), Buffer.from("pool_account")],
    program.programId
  );

  try {
    const accountInfo = await program.account.poolAccount.fetch(poolAccount);

    // TODO: format ether total distribution
    return [
      poolAccount,
      poolAccountBump,
      {
        ...accountInfo,
        poolName,
      },
    ];
  } catch (e) {
    return [poolAccount, poolAccountBump, undefined];
  }
};
