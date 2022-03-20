import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { NFTContext } from "~/nft/NFTContext";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { programs } from "@metaplex/js";
import { getTokenAccount } from "@project-serum/common";
import { useWorkspace } from "~/workspace/hooks";
import { useMintInfo } from "~/hooks/useMintInfo";
import { BN } from "@project-serum/anchor";
import { getMetadata } from "~/api/solana/utils";
import axios from "axios";
const {
  metadata: { MetadataData },
} = programs;

export const useNFT = () => useContext(NFTContext);
export interface NFTAccount {
  tokenAccountAddress: PublicKey;
  mint: PublicKey;
}

export interface NFTAccountData {
  tokenAccountAddress: string;
  mint: string;
  data: any;
}

export const useMetadata = (
  mintAddress?: string,
  tokenAccountAddress?: string
) => {
  const { provider } = useWorkspace();
  const [accountInfo, setAccountInfo] = useState<any>();
  const [data, setData] = useState<MetadataResponse>();
  const [initialize, setInitialize] = useState(false);
  const mintAccount = useMemo(
    () => (mintAddress ? new PublicKey(mintAddress) : undefined),
    [mintAddress]
  );

  const tokenAccount = useMemo(
    () =>
      tokenAccountAddress ? new PublicKey(tokenAccountAddress) : undefined,
    [tokenAccountAddress]
  );

  const mintInfo = useMintInfo(mintAccount);

  const fetchMetadata = useCallback(async () => {
    if (!mintInfo || !tokenAccount || !mintAccount) return;

    try {
      const tokenAccountInfo = await getTokenAccount(provider, tokenAccount);
      if (!tokenAccountInfo.amount.eq(new BN(1))) throw new Error("not nft");

      const metadataAccount = await getMetadata(mintAccount);
      const metadataAccountInfo = await provider.connection.getAccountInfo(
        metadataAccount
      );
      if (!metadataAccountInfo) throw new Error("metadata not found");

      const metadataData = MetadataData.deserialize(metadataAccountInfo.data);
      const { uri } = metadataData.data;
      // console.log(
      //   uri.replace("https://api.solrace.xyz", "http://localhost:8080")
      // );
      // const { data: _data } = await axios.get(uri);
      const { data: _data } = await axios.get(uri);
      setAccountInfo(metadataData);
      setData(_data);
    } catch (e) {
      console.log(e);
    } finally {
      setInitialize(true);
    }
  }, [provider, mintInfo, mintAccount, tokenAccount]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);
  return {
    data,
    accountInfo,
    initialize,
    revalidateMetadata: fetchMetadata,
    mintAccount,
    tokenAccount,
  };
};
