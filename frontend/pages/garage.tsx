import styled from "styled-components";
import Link from "next/link";
import { toast } from "react-toastify";
import AppLayout from "~/app/AppLayout";
import { useWorkspace } from "~/workspace/hooks";
import { useAllNFT, useNFT } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import { usePoolAccount } from "~/hooks/useAccount";
import GarageCard from "~/garage/GarageCard";
import Button from "~/ui/button/Button";
import Title from "~/ui/title/Title";
import { Paragraph, ParagraphItalic, Row } from "~/ui";
import { useWallet } from "@solana/wallet-adapter-react";

import { usePool } from "~/pool/hooks";
import InventoryLayout from "~/inventory";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CardSkeleton } from "~/ui/card";
import { GatewayStatus } from "@civic/solana-gateway-react";
import { useMemo } from "react";
import { GARAGE_COLLECTION_NAME } from "~/garage/constants";
import { handleMintError } from "~/mint/services";
import { toastAPIError } from "~/utils";
import mint from "./mint";

const GaragePage = () => {
  const { provider, wallet } = useWorkspace();
  const { poolInfo, apr } = usePool();
  const { connected } = useWallet();
  // const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { getNFTOfCollection, revalidateNFTs } = useNFT();

  const garages = useMemo(() => {
    return getNFTOfCollection(GARAGE_COLLECTION_NAME);
  }, [getNFTOfCollection]);

  let cards = poolInfo ? (
    <Main>
      {garages.map((garage) => (
        <Link
          key={garage.tokenAccountAddress}
          href={{
            pathname: `/garage/${garage.tokenAccountAddress}`,
            query: {
              mint: garage.mint.toString(),
              tokenAccountAddress: garage.tokenAccountAddress,
            },
          }}
        >
          <a>
            <GarageCard key={garage.tokenAccountAddress} garage={garage} />
          </a>
        </Link>
      ))}
    </Main>
  ) : (
    <Skeleton wrapper={CardSkeleton} count={1} />
  );

  return (
    <InventoryLayout direction="row-reverse" cards={cards}>
      <TitleDiv>
        <h3>GARAGE - stake your karts and earn passive rewards</h3>
      </TitleDiv>

      {!connected ? <Paragraph>Please Connect Your Wallet</Paragraph> : ""}
    </InventoryLayout>
  );
};

const Main = styled(Row)`
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: space-between;
  align-content: space-between;
`;

const TitleDiv = styled.div`
  background: var(--color-primary-light);
  width: fit-content;
  padding: 0.5rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  gap: 2rem;
  margin-bottom: 1rem;
`;

export default GaragePage;
