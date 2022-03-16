import styled from "styled-components";
import Link from "next/link";
import { toast } from "react-toastify";
import AppLayout from "~/app/AppLayout";
import { useWorkspace } from "~/workspace/hooks";
import { useAllNFT } from "~/nft/hooks";
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

const GaragePage = () => {
  const { provider, wallet } = useWorkspace();
  const { poolInfo, apr } = usePool();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);

  let cards = poolInfo ? (
    <Main>
      {nfts.map((nft) => (
        <Link
          href={{
            pathname: `/garage/${nft.tokenAccountAddress.toBase58()}`,
            query: {
              mint: nft.mint.toString(),
              tokenAccountAddress: nft.tokenAccountAddress.toString(),
            },
          }}
        >
          <a>
            <GarageCard key={nft.tokenAccountAddress.toBase58()} nft={nft} />
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
      {/* <ParagraphDiv>
        <Paragraph>
          &nbsp; &nbsp; &nbsp; &nbsp; Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Sed inventore repellendus doloremque quam earum quia
          magni quo blanditiis vitae doloribus incidunt quasi minus fugiat, sint
          voluptatem facere deleniti tempore, veritatis assumenda! Eos fugit
          magni recusandae ipsum nostrum debitis,
        </Paragraph>
        <Paragraph>
          &nbsp; &nbsp; &nbsp; &nbsp;Molestias aliquid accusantium, dolores
          consequuntur officia soluta placeat, l abore ex ipsam doloremque
          nostrum et ea rerum animi, omnis esse vel. Quis aspernatur quibusdam
          maxime velit explicabo aut? Commodi asperiores,
        </Paragraph>
        <Paragraph>
          &nbsp; &nbsp; &nbsp; &nbsp;Molestias aliquid accusantium, dolores
          consequuntur officia soluta placeat, l abore ex ipsam doloremque
          nostrum et ea rerum animi, omnis esse.
        </Paragraph>
      </ParagraphDiv> */}
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

const ParagraphDiv = styled.div`
  background: var(--color-primary-light);
  width: 100%;
  padding: 0.5rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  gap: 2rem;
`;

export default GaragePage;
