import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import MintLayout from "~/mint/MintLayout";
import AppLayout from "~/app/AppLayout";
import Title from "~/ui/title/Title";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { Paragraph } from "~/ui";

const MintPage = () => {
  const { connected } = useWallet();
  return (
    <AppLayout>
      <WrapperMint>
        <Title>MINT</Title>
        {!connected ? (
          <Paragraph>Please Connect Your Wallet</Paragraph>
        ) : (
          <MintLayout />
        )}
      </WrapperMint>
    </AppLayout>
  );
};

const WrapperMint = styled.div`
  margin-top: 2rem;
`;

export default MintPage;
