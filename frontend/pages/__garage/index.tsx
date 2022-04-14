import styled from "styled-components";
import Link from "next/link";
import { useWorkspace } from "~/workspace/hooks";
import { useNFT } from "~/nft/hooks";
import GarageCard from "~/garage/GarageCard";

import { Paragraph, Row } from "~/ui";
import { useWallet } from "@solana/wallet-adapter-react";

import { usePool } from "~/pool/hooks";
import InventoryLayout from "~/inventory";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CardSkeleton } from "~/ui/card";

import { useMemo } from "react";
import { GARAGE_COLLECTION_NAME } from "~/garage/constants";

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
            pathname: `/garage/${garage.data.name.split("#")[1]}`,
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
    <InventoryLayout direction="row-reverse" cards={cards} page="garage">
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
  gap: 0.75rem;
  align-items: space-between;
  align-content: space-between;
  & > * {
    margin-bottom: 0.5rem;
  }
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
  gap: 1rem;
  margin-bottom: 1rem;
`;

export default GaragePage;
