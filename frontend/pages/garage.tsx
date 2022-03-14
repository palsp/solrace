import styled from "styled-components";
import Link from "next/link";
import { toast } from "react-toastify";
import AppLayout from "~/app/AppLayout";
import { useWorkspace } from "~/workspace/hooks";
import { useAllNFT } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import { usePoolAccount } from "~/hooks/useAccount";
import { mint } from "~/mint/services";
import GarageCard from "~/garage/GarageCard";
import Button from "~/ui/button/Button";
import Title from "~/ui/title/Title";
import { Paragraph, ParagraphItalic, Row } from "~/ui";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { useMemo } from "react";
import { BN } from "@project-serum/anchor";
import { usePool } from "~/pool/hooks";

const Main = styled(Row)`
  justify-content: space-around;
  flex-wrap: wrap;
`;

const GaragePage = () => {
  const { provider, wallet } = useWorkspace();
  const { poolInfo, apr } = usePool();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);

  const handleMint = async () => {
    if (!provider || !wallet) {
      toast("Please connect wallet", { type: "warning" });
      return;
    }

    try {
      const tx = await mint(wallet.publicKey, provider);
      const resp = await provider.connection.confirmTransaction(tx);
      if (resp.value.err) {
        toast("Mint Failed", { type: "error" });
      } else {
        toast("Mint Succeed", { type: "success" });
      }
      await revalidateNFTs();
    } catch (e) {
      console.log(e);
      toast("Mint Failed", { type: "error" });
    }
  };

  return (
    <AppLayout>
      <WrapperGarage>
        <TitleDiv>
          <h3>GARAGE - stake your karts and earn passive rewards</h3>
        </TitleDiv>
        {!connected ? (
          <Paragraph>Please Connect Your Wallet</Paragraph>
        ) : (
          <>
            {poolInfo && (
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
                      <GarageCard
                        key={nft.tokenAccountAddress.toBase58()}
                        nft={nft}
                      />
                    </a>
                  </Link>
                ))}
              </Main>
            )}
          </>
        )}
      </WrapperGarage>
    </AppLayout>
  );
};

const WrapperGarage = styled.div`
  margin-top: 2rem;
`;

const TitleDiv = styled.div`
  background: var(--color-primary-light);
  width: fit-content;
  margin: 2rem 0;
  padding: 0.5rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  gap: 2rem;
`;

export default GaragePage;
