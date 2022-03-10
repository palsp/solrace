import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { backButton, backButtonPrimary, backButtonSecondary } from "~/assets";

interface Props {
  direction: string;
}

const AuthLayout: React.FC<Props> = ({ children, direction }) => {
  let backButton =
    direction === "row" ? backButtonPrimary : backButtonSecondary;
  return (
    <AuthLayoutContainer direction={direction}>
      <Link href="/">
        <a>
          <WrapperIcon>
            <Image src={backButton} width={40} height={40} />
          </WrapperIcon>
        </a>
      </Link>

      <WrapperDecorative></WrapperDecorative>
      <AuthForm>{children}</AuthForm>
    </AuthLayoutContainer>
  );
};

const AuthLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props: Props) => props.direction};
`;

const WrapperDecorative = styled.div`
  flex: 4;
  background: var(--color-black-light);
`;

const WrapperIcon = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
`;
const AuthForm = styled.div`
  flex: 6;
  background: var(--background-gradient);
`;
export default AuthLayout;
