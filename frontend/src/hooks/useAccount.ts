import { useState, useCallback, useEffect, useMemo } from "react";
import { SolRaceCore, IDL } from "~/api/solana/types/sol_race_core";

import { PublicKey } from "@solana/web3.js";
import { useWorkspace } from "~/workspace/hooks";
import { useProgram } from "~/hooks/useProgram";
import { fetchPoolInfo } from "~/api/solana/account/pool-account";
import { fetchStakeInfo } from "~/api/solana/account/stake-account";
import { SOL_RACE_CORE_PROGRAM_ID } from "~/api/solana/addresses";
import { fetchKartInfo } from "~/api/solana/account/kart-account";

export type PoolAccount = typeof IDL.accounts[0];
export type StakingAccount = typeof IDL.accounts[1];

const useAccount = <T>(fetchInfo: () => Promise<T>) => {
  const [accountInfo, setAccountInfo] = useState<T>();

  const revalidate = useCallback(async () => {
    try {
      setAccountInfo(await fetchInfo());
    } catch (e) {
      setAccountInfo(undefined);
    }
  }, [fetchInfo]);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return { accountInfo, revalidate };
};

// use isInitialize to determine loading is finish or not, if isInitialize = undefined then loading else finish

export const usePoolAccount = (poolName: string) => {
  const program = useProgram<SolRaceCore>(IDL, SOL_RACE_CORE_PROGRAM_ID);
  const [publicAddress, setPublicAddress] = useState<PublicKey>();
  const [bump, setBump] = useState<number>();

  const fetchInfo = useCallback(async () => {
    const [poolAccount, poolAccountBump, poolInfo] = await fetchPoolInfo({
      program,
      poolName,
    });

    setPublicAddress(poolAccount);
    setBump(poolAccountBump);
    return poolInfo;
  }, [program, poolName]);

  const { accountInfo, revalidate } = useAccount(fetchInfo);

  return { poolInfo: accountInfo, publicAddress, bump, revalidate };
};

export const useStakeAccount = (
  poolName: string,
  garageMintAccount: PublicKey
) => {
  const program = useProgram<SolRaceCore>(IDL, SOL_RACE_CORE_PROGRAM_ID);
  const { wallet } = useWorkspace();
  const [isStaked, setIsStaked] = useState<boolean>();
  const [publicAddress, setPublicAddress] = useState<PublicKey>();
  const [bump, setBump] = useState<number>();
  const [isInitialize, setIsInitialize] = useState<boolean>();

  const fetchInfo = useCallback(async () => {
    if (!wallet) return undefined;
    const [stakingAccount, stakingAccountBump, info] = await fetchStakeInfo({
      program,
      poolName,
      user: wallet.publicKey,
      garageMintAccount,
    });
    setPublicAddress(stakingAccount);
    setBump(stakingAccountBump);
    if (!info) {
      setIsInitialize(false);
      setIsStaked(false);
    } else {
      setIsInitialize(true);
      setIsStaked(info.isBond);
    }

    return info;
  }, [program, poolName, garageMintAccount, wallet]);

  const { accountInfo, revalidate } = useAccount(fetchInfo);

  const isLoading = useMemo(() => {
    return bump === undefined || !publicAddress || isInitialize === undefined;
  }, [bump, publicAddress, isInitialize]);

  return {
    stakeInfo: accountInfo,
    isInitialize,
    isStaked,
    publicAddress,
    bump,
    isLoading,
    revalidate,
  };
};

export const useKartAccount = (poolName: string, kartMint: PublicKey) => {
  const program = useProgram<SolRaceCore>(IDL, SOL_RACE_CORE_PROGRAM_ID);
  const { wallet } = useWorkspace();

  const [publicAddress, setPublicAddress] = useState<PublicKey>();
  const [isInitialize, setIsInitialize] = useState<boolean>();
  const [bump, setBump] = useState<number>();

  const fetchInfo = useCallback(async () => {
    if (!wallet) return undefined;
    const [kartAccount, kartAccountBump, info] = await fetchKartInfo({
      program,
      poolName,
      kartMint,
      user: wallet.publicKey,
    });

    setPublicAddress(kartAccount);
    setBump(kartAccountBump);

    if (!info) {
      setIsInitialize(false);
    } else {
      setIsInitialize(true);
    }

    return info;
  }, [program, wallet, kartMint, poolName]);

  const { accountInfo, revalidate } = useAccount(fetchInfo);

  const isLoading = useMemo(() => {
    return bump === undefined || !publicAddress || isInitialize === undefined;
  }, [bump, publicAddress, isInitialize]);

  return {
    kartInfo: accountInfo,
    publicAddress,
    isInitialize,
    bump,
    isLoading,
    revalidate,
  };
};
