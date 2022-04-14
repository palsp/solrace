import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { toast } from "react-toastify";

import AppLayout from "~/app/AppLayout";
import { useAuth, useRequireAuth } from "~/auth/hooks";
import { Button, Column, Paragraph } from "~/ui";
import { useLinkedWallet } from "~/wallet/hooks";
import { useWorkspace } from "~/workspace/hooks";
import {
  deleteWallet,
  linkWallet,
  requestSigningMessage,
  signWallet,
  verifySignature,
} from "~/wallet/services";
import { shortenIfAddress } from "~/wallet/utils";
import { toastAPIError } from "~/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import AuthLayout from "~/auth/AuthLayout";
import AppNav from "~/app/AppNav";

const AccountPage = () => {
  useRequireAuth();

  const wallet = useWallet();
  const { publicAddress, revalidate } = useLinkedWallet();
  const { push } = useRouter();

  const { user, logout } = useAuth();

  const toggle = async () => {
    if (!user) {
      push("/login");
      return;
    }

    if (!wallet || !wallet.publicKey) {
      toast("Please Connect Wallet", {
        type: "warning",
      });
      return;
    }

    if (!publicAddress) {
      try {
        await linkWallet(wallet);
        await revalidate();
        toast("Connect wallet success", {
          type: "success",
        });
      } catch (e) {
        toastAPIError(e as any);
      }
    } else {
      if (
        wallet.publicKey.toBase58().toLowerCase() !==
        publicAddress.toLowerCase()
      ) {
        toast(
          "The current connected wallet address does not match your linked wallet, please switch to the linked wallet",
          {
            type: "warning",
          }
        );
        return;
      }
      try {
        await deleteWallet(wallet);
        await revalidate();
        toast("Your wallet has been disconnect", { type: "success" });
      } catch (e) {
        toastAPIError(e as any);
      }
    }
  };

  const verify = async () => {
    if (!wallet || !wallet.publicKey) {
      toast("Please Connect Wallet", {
        type: "warning",
      });
      return;
    }
    try {
      const { message } = await requestSigningMessage();
      const { signature, publicAddress } = await signWallet(wallet, message);
      await verifySignature(publicAddress, signature);
      toast("Signature Verified", {
        type: "success",
      });
    } catch (e) {
      toastAPIError(e);
    }
  };

  useEffect(() => {
    if (user) {
      revalidate();
    }
  }, [user]);

  const getButtonContent = () => {
    if (!user) {
      return "Connect Wallet with your ID";
    }
    // wallet not found
    if (publicAddress === null) {
      return "Please Connect Your Phantom Wallet";
    }

    return `Disconnect ${shortenIfAddress(publicAddress)}`;
  };

  return (
    <>
      <WrapperAppNav>
        <AppNav />
      </WrapperAppNav>
      <AuthLayout direction="row">
        <TitleDiv>
          <h1>Account</h1>

          <Paragraph>Customize your account settings here</Paragraph>
        </TitleDiv>

        <Button type="button" onClick={toggle} color="primary" width="350px">
          {getButtonContent()}
        </Button>
        <Button onClick={verify} color="primary" width="350px">
          Verify
        </Button>
        <Button onClick={logout} color="primary" width="350px">
          Logout
        </Button>
      </AuthLayout>
    </>
  );
};
const WrapperAppNav = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const TitleDiv = styled.div`
  text-align: start;
`;

export default AccountPage;
