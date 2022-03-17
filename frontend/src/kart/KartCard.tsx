import { useCallback, useEffect, useMemo, useState } from "react";

import { NFTAccountData } from "~/nft/hooks";
import { useWorkspace } from "~/workspace/hooks";
import { useKartAccount } from "~/hooks/useAccount";
import { AppImage, Column, Paragraph } from "~/ui";
import { usePool } from "~/pool/hooks";
import Card from "~/ui/card/Card";
import axios from "axios";

interface Props {
  kart: NFTAccountData;
}

const KartCard: React.FC<Props> = ({ kart }) => {
  const [image, setImage] = useState<string>();

  const fetchKartImage = useCallback(async () => {
    const { data } = await axios.get(kart.data.uri);

    setImage(data.image);
  }, [kart]);

  useEffect(() => {
    fetchKartImage();
  }, [fetchKartImage]);

  return (
    <Card type="kart" image={image} name={kart.data.name}>
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
