import { useNFT } from "~/nft/hooks";
import styled from "styled-components";

import { Paragraph, Row } from "~/ui";
import KartCard from "~/kart/KartCard";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePool } from "~/pool/hooks";
import Link from "next/link";
import InventoryLayout from "~/inventory";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CardSkeleton } from "~/ui/card";
import { useMemo } from "react";
import { KART_COLLECTION_NAME } from "~/kart/constants";

const KartPage = () => {
  const { connected } = useWallet();

  // const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { getNFTOfCollection, revalidateNFTs } = useNFT();
  const karts = useMemo(() => {
    return getNFTOfCollection(KART_COLLECTION_NAME);
  }, [getNFTOfCollection]);

  const { poolInfo } = usePool();
  let cards = poolInfo ? (
    <Main>
      {karts.map((kart) => (
        <Link
          key={kart.tokenAccountAddress}
          href={{
            pathname: `/kart/${kart.data.name.split("#")[1]}`,
            query: {
              mint: kart.mint.toString(),
              tokenAccountAddress: kart.tokenAccountAddress,
            },
          }}
        >
          <a>
            <KartCard kart={kart} />
          </a>
        </Link>
      ))}
    </Main>
  ) : (
    <Skeleton wrapper={CardSkeleton} count={1} />
  );
  return (
    <InventoryLayout direction="row" cards={cards} page="kart">
      <TitleDiv>
        <h3>KART - your karts collection</h3>
      </TitleDiv>
      {!connected ? <Paragraph>Please Connect Your Wallet</Paragraph> : ""}
    </InventoryLayout>
  );
};

const Main = styled(Row)`
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: space-between;
  & > * {
    margin-bottom: 0.5rem;
  }
`;

const TitleDiv = styled.div`
  background: var(--color-primary-light);
  width: 100%;
  padding: 0.5rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  gap: 2rem;
  margin-bottom: 1rem;
`;

export default KartPage;
