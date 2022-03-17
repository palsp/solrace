import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";
import InventoryLayout from "~/inventory";
import { KART_COLLECTION_NAME } from "~/kart/constants";
import KartCard from "~/kart/KartCard";
import { useNFT } from "~/nft/hooks";
import { usePool } from "~/pool/hooks";
import { Row } from "~/ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CardSkeleton } from "~/ui/card";

const MarketplacePage = () => {
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
            pathname: `/kart/${kart.tokenAccountAddress}`,
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
  return <InventoryLayout direction="row" page="marketplace"></InventoryLayout>;
};
const Main = styled(Row)`
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: space-between;
  & > * {
    margin-bottom: 0.5rem;
  }
`;

export default MarketplacePage;
