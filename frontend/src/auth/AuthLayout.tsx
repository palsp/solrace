import Link from "next/link";
import styled from "styled-components";

interface Props {
  direction: string;
}

const AuthLayout: React.FC<Props> = ({ children, direction }) => {
  return (
    <AuthLayoutContainer direction={direction}>
      <DecorativeWrapper></DecorativeWrapper>
      <AuthForm>{children}</AuthForm>
    </AuthLayoutContainer>
  );
};

const AuthLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props: Props) => props.direction};
`;

const DecorativeWrapper = styled.div`
  flex: 4;
  background: var(--color-black-light);
`;
const AuthForm = styled.div`
  flex: 6;
  background: var(--background-gradient);
`;
export default AuthLayout;
