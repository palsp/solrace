import _ from "lodash";
import { BN, Program } from "@project-serum/anchor";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { SolRaceCore } from "~/api/solana/types/sol_race_core";

import bs58 from "bs58";

export interface StakeInfo {
  garageMint: PublicKey;
  garageMetadataAccount: PublicKey;
  garageMasterEdition: PublicKey;
  isBond: boolean;
  rewardIndex: number;
  pendingReward: number;
  multiplier: BN;
}

export interface Staker extends StakeInfo {
  publicAddress: PublicKey;
}

type FetchStakeInfo = {
  program: Program<SolRaceCore>;
  poolName: string;
  user: PublicKey;
  garageMintAccount: PublicKey;
};

type GetStakers = {
  program: Program<SolRaceCore>;
  filterOnlyStake?: boolean;
};

export const fetchStakeInfo = async ({
  program,
  poolName,
  garageMintAccount,
}: FetchStakeInfo): Promise<[PublicKey, number, StakeInfo | undefined]> => {
  const [
    stakingAccount,
    stakingAccountBump,
  ] = await PublicKey.findProgramAddress(
    [
      Buffer.from("staking_account"),
      Buffer.from(poolName),
      garageMintAccount.toBuffer(),
    ],
    program.programId
  );

  try {
    const stakeInfo = await program.account.stakingAccount.fetch(
      stakingAccount
    );

    const { pendingReward, ...cleanStakeInfo } = stakeInfo;
    return [
      stakingAccount,
      stakingAccountBump,
      {
        ...cleanStakeInfo,
        pendingReward: pendingReward.toNumber(),
      },
    ];
  } catch (e) {
    return [stakingAccount, stakingAccountBump, undefined];
  }
};

const getIsStakedFilter = (): GetProgramAccountsFilter => ({
  memcmp: {
    offset:
      8 + // Discriminator
      32 + // garage_mint
      32 + // garage_metadata_account
      32, //garage_master_edition
    bytes: bs58.encode([1]),
  },
});

export const getStakers = async ({
  program,
  filterOnlyStake = true,
}: GetStakers): Promise<Staker[]> => {
  const stakeAccounts = await program.account.stakingAccount.all(
    filterOnlyStake ? [getIsStakedFilter()] : []
  );

  return stakeAccounts.map((stakerInfo) => {
    const { publicKey, account } = stakerInfo;

    const { pendingReward, ...cleanStakeInfo } = account;

    return {
      ...cleanStakeInfo,
      pendingReward: pendingReward.toNumber(),
      publicAddress: publicKey,
    };
  });
};
