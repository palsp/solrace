import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { backButton, backButtonPrimary, backButtonSecondary } from "~/assets";
import { AppImage } from "~/ui";
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
      {/* &#10023; */}
      <WrapperDecorative>
        <WrapperLogo>
          <AppImage
            src="/solrace-logo-white.png"
            width="300px"
            height="70px"
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          />
        </WrapperLogo>
        <Star direction={direction}>&#10022;</Star>
        <Line1 />
        <Line2 />
        <Line3 />
        <Line4 />
        <Line5 />
        <Line6 />
        <Line7 />
        <Line8 />
        <Line9 />
        <Line10 />
        <Line11 />
        <Line12 />
        <Line13 />
        <Line14 />
        <Line15 />
        <Line16 />
        <Line17 />
      </WrapperDecorative>
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
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;
const WrapperAuth = styled.div`
  background: var(--color-white);
  min-width: 450px;
  height: 600px;
  border-radius: 0.25rem;
  padding: 0 3rem;
  box-shadow: ${(props: Props) => {
    if (props.direction === "row")
      return "var(--shadow-elevation-medium-secondary)";
    return "var(--shadow-elevation-medium-primary)";
  }};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;
const WrapperIcon = styled.div`
  position: fixed;
  isolation: isolate;
  top: 2rem;
  left: 2rem;
  z-index: 1;
  transition: opacity ease 500ms;

  &:hover {
    opacity: 0.65;
  }
`;

const WrapperLogo = styled.div`
  margin: 0 auto;
  width: 300px;
  margin-top: 0.75rem;
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

const Star = styled.div`
  position: fixed;
  top: calc(50vh - 128px);
  transform: translateX(-50%);
  left: ${(props: Props) => {
    if (props.direction === "row") return "40%";
    return "";
  }};
  background: "white";
  font-size: 128px;
  color: ${(props: Props) => {
    if (props.direction === "row") return "var(--color-primary-light)";
    return "var(--color-secondary-light)";
  }}; ;
`;
const Line = styled.div`
  position: absolute;
  width: 100vw;
  height: 50vh;
  z-index: 1;
  border: 1px solid var(--color-white);
  /* outline: 1px solid white; */
  border-radius: 50%;
  box-sizing: border-box;
`;
const Line1 = styled(Line)`
  left: 40px;
  bottom: 10px;
`;
const Line2 = styled(Line)`
  left: 80px;
  bottom: 20px;
`;
const Line3 = styled(Line)`
  left: 120px;
  bottom: 20px;
`;
const Line4 = styled(Line)`
  left: 160px;
  bottom: 20px;
`;
const Line5 = styled(Line)`
  left: 67px;
  bottom: 20px;
`;
const Line6 = styled(Line)`
  left: 200px;
  bottom: 10px;
`;
const Line7 = styled(Line)`
  left: 360px;
  bottom: 30px;
`;
const Line8 = styled(Line)`
  left: 50px;
  bottom: -10px;
`;
const Line9 = styled(Line)`
  left: 160px;
  bottom: 90px;
`;
const Line10 = styled(Line)`
  left: 200px;
  bottom: 106px;
`;
const Line11 = styled(Line)`
  left: 260px;
  bottom: 16px;
`;
const Line12 = styled(Line)`
  left: 200px;
  bottom: 36px;
`;
const Line13 = styled(Line)`
  left: 250px;
  bottom: 70px;
`;
const Line14 = styled(Line)`
  left: 300px;
  bottom: 40px;
`;
const Line15 = styled(Line)`
  left: 350px;
  bottom: 20px;
`;
const Line16 = styled(Line)`
  left: 400px;
  bottom: 12px;
`;
const Line17 = styled(Line)`
  left: 120px;
  bottom: 89px;
`;
export default AuthLayout;
