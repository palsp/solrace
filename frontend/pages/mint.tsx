import MintLayout from "~/mint/MintLayout";
import AppLayout from "~/app/AppLayout";
import Title from "~/ui/title/Title";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";

const MintPage = () => {
  const { connected } = useWallet();
  return (
    <AppLayout>
      <Title>MINT</Title>
      {!connected ? (
        <ConnectWalletButton>Mint</ConnectWalletButton>
      ) : (
        <MintLayout />
      )}
    </AppLayout>
  );
};

export default MintPage;
