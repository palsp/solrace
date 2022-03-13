import React from "react";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import { useWorkspace } from "~/workspace/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAllNFT } from "~/nft/hooks";
import { usePool } from "~/pool/hooks";

const kartDetail = () => {
  const router = useRouter();
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { poolInfo } = usePool();
  const { kartDetail: tokenId } = router.query;
  return <AppLayout>{tokenId}</AppLayout>;
};

export default kartDetail;
