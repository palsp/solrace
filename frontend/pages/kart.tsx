import { toast } from "react-toastify";
import AppLayout from "~/app/AppLayout";
import { useAllNFT, useNFT } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import styled from "styled-components";

import { useWorkspace } from "~/workspace/hooks";
import { mint } from "~/mint/services";
import Title from "~/ui/title/Title";
import Button from "~/ui/button/Button";
import { Paragraph, Row } from "~/ui";
import { usePoolAccount } from "~/hooks/useAccount";
import KartCard from "~/kart/KartCard";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { usePool } from "~/pool/hooks";
import Link from "next/link";
import InventoryLayout from "~/inventory";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CardSkeleton } from "~/ui/card";
import { useMemo } from "react";
import { KART_COLLECTION_NAME } from "~/kart/constants";

const KartPage = () => {
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();

  // const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { getNFTOfCollection, revalidateNFTs } = useNFT();
  const karts = useMemo(() => {
    return getNFTOfCollection(KART_COLLECTION_NAME);
  }, [getNFTOfCollection]);
  console.log("karts", karts);
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
