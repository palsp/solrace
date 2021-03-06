import styled from "styled-components";
import { useAuth } from "~/auth/hooks";
import Link from "next/link";
import { AppLink, Row } from "~/ui";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { AppImage } from "~/ui";
import { useWallet } from "@solana/wallet-adapter-react";

const AppNav = () => {
  const { user } = useAuth();
  const { connected } = useWallet();

  return (
    <NavContainer>
      <UserSection>
        <Link href="/" passHref>
          <AppImage
            src="/solrace-logo.png"
            width="200px"
            height="40px"
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          />
        </Link>

        {/* <AppLink href="/garage">GARAGE</AppLink> */}
        {/* <AppLink href="/kart">KART</AppLink> */}
        {/* <AppLink href="/marketplace">MARKETPLACE</AppLink> */}

        {/* {!user ? (
          <div>
            <>
              <AppLink href="/login">LOGIN</AppLink>
              {" | "}
              <AppLink href="/register">REGISTER</AppLink>
            </>
          </div>
        ) : (
          <div>
            <AppLink href="/account">ACCOUNT</AppLink>
          </div>
        )} */}

        <NavSection>
          <AppLink href="/mint">Browse Collection</AppLink>
          <WrapperConnectWalletButton>
            <ConnectWalletButton>
              {!connected ? "Connect Wallet" : "Disconnect"}
            </ConnectWalletButton>
          </WrapperConnectWalletButton>
        </NavSection>
      </UserSection>
    </NavContainer>
  );
};

const WrapperConnectWalletButton = styled.div`
  align-self: end;
  margin-left: 1rem;
`;

const UserSection = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
`;

const NavSection = styled(Row)`
  margin-right: 1rem;
  justify-content: space-between;
`;

const NavContainer = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
`;

export default AppNav;
