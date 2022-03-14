import React from "react";
import styled from "styled-components";

import { useRouter } from "next/router";
import { useWorkspace } from "~/workspace/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAllNFT } from "~/nft/hooks";
import { usePool } from "~/pool/hooks";
import { Model3D } from "~/ui";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";

const KartDetail = () => {
  const router = useRouter();
  const { kartDetail: tokenId } = router.query;
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { poolInfo } = usePool();
  return (
    <TokenDetailLayout direction="row" token3D={<Model3D />} tokenDetail="">
      {tokenId}
    </TokenDetailLayout>
  );
};

export default KartDetail;
