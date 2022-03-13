import React from "react";
import styled from "styled-components";

import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import { useWorkspace } from "~/workspace/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAllNFT } from "~/nft/hooks";
import { usePool } from "~/pool/hooks";
import { Model3D } from "~/ui";

const kartDetail = () => {
  const router = useRouter();
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { poolInfo } = usePool();
  const { kartDetail: tokenId } = router.query;
  return (
    <AppLayout>
      {tokenId}
      <WrapperModel3D>
        <Model3D />
      </WrapperModel3D>
    </AppLayout>
  );
};

const WrapperModel3D = styled.div`
  /* width: 500px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default kartDetail;
