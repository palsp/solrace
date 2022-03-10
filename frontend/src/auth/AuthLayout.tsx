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
      <AuthForm>
        <WrapperAuth direction={direction}>{children}</WrapperAuth>
      </AuthForm>
    </AuthLayoutContainer>
  );
};

const AuthLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  /* align-items: center; */
  flex-direction: ${(props: Props) => props.direction};
`;

const WrapperDecorative = styled.div`
  flex: 4;
  background: var(--color-black-light);
`;
const WrapperAuth = styled.div`
  background: var(--color-white);
  min-width: 450px;
  height: 450px;
  border-radius: 0.25rem;
  padding: 0 3rem;
  box-shadow: ${(props: Props) => {
    if (props.direction === "row")
      return "var(--shadow-elevation-medium-secondary)";
    return "var(--shadow-elevation-medium-primary)";
  }};
`;
const WrapperIcon = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
`;
const AuthForm = styled.div`
  flex: 6;
  background: var(--background-gradient);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;
`;
export default AuthLayout;
