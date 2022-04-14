import styled from "styled-components";
import { useAuth } from "~/auth/hooks";
import Link from "next/link";
import { AppLink, Row } from "~/ui";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { AppImage } from "~/ui";
import { useWallet } from "@solana/wallet-adapter-react";

const HomeNav = () => {
  const { connected } = useWallet();
  return (
    <NavContainer>
      <UserSection>
        <Link href="/" passHref>
          <AppImage
            src="/solrace-logo-white.png"
            width="200px"
            height="40px"
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          />
        </Link>

        <NavSection>
          <AppLink href="/" textColor="white">
            Home
          </AppLink>
          <AppLink
            href="https://drive.google.com/file/d/10FxikBiqguOP5KLIWHHQmvIPby_8Bt5m/view"
            textColor="white"
            target="_blank"
          >
            Litepaper
          </AppLink>
          {/* <AppLink href="/marketplace" textColor="white">
          Marketplace
        </AppLink>
        <AppLink href="/mint" textColor="white">
          Buy GARAGE
        </AppLink> */}

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
`;

const UserSection = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 5rem;
`;

const NavSection = styled(Row)`
  margin-right: 1rem;
  justify-content: space-between;
  width: 40%;
`;

const NavContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border-bottom: 1px solid var(--color-white);
`;
export default HomeNav;
