import styled from "styled-components";
import { useAuth } from "~/auth/hooks";
import Link from "next/link";
import { AppLink, Row } from "~/ui";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import Image from "~/ui/Image";

const AppNav = () => {
  const { user } = useAuth();

  return (
    <NavContainer>
      <UserSection>
        <Link href="/" passHref>
          <Image
            src="/logo.png"
            width="200px"
            height="50px"
            style={{ cursor: "pointer", paddingBottom: "1rem" }}
          />
        </Link>
        <AppLink href="/garage">GARAGE</AppLink>
        <AppLink href="/kart">KART</AppLink>
        {!user ? (
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
        )}
        <WrapperConnectWalletButton>
          <ConnectWalletButton />
        </WrapperConnectWalletButton>
      </UserSection>
    </NavContainer>
  );
};

const WrapperConnectWalletButton = styled.div`
  align-self: end;
`;

const UserSection = styled(Row)`
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  gap: 5rem;
`;

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2em;
`;

export default AppNav;
