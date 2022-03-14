import styled from "styled-components";
import { useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { NFTAccount } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import { shortenIfAddress } from "~/wallet/utils";
import { useWorkspace } from "~/workspace/hooks";
import { useKartAccount } from "~/hooks/useAccount";
import { AppImage, Column, Paragraph } from "~/ui";
import { usePool } from "~/pool/hooks";
import Card from "~/ui/card/Card";

interface Props {
  nft: NFTAccount;
}

const KartCard: React.FC<Props> = ({ nft }) => {
  const { provider } = useWorkspace();

  return (
    <Card type="kart">
      {/* <WrapperCardContent> */}
      {/* <h3>Mint: {shortenIfAddress(nft.mint.toBase58())}</h3>
        <p>Max Speed: {kartInfo?.masSpeed || 0}</p> */}
      {/* <AppImage src="/kart-template.png" height="300px" width="350px" /> */}

      {/* <WrapperDescription>
        <TextDescription>
          <Paragraph>Model: ZGMF-X42F Helios</Paragraph>
          <Paragraph>Rarity: AR</Paragraph>
          <Paragraph>Max Speed: 5</Paragraph>
        </TextDescription>
        <PriceDescription>
          <AppImage src="/sol-logo.png" width="25px" height="25px"></AppImage>

          <Paragraph>5.43</Paragraph>
        </PriceDescription>
      </WrapperDescription> */}
      {/* </WrapperCardContent> */}
    </Card>
  );
};

export default KartCard;
