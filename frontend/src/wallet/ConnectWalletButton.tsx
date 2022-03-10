import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from "styled-components";
interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const StyledWalletButton = ({ children }: Props) => {
  return (
    <WrapperButton>
      <Span>{children}</Span>
    </WrapperButton>
  );
};

const Span = styled.span`
  color: black;
  position: relative;
  z-index: 1;
  transition: color 0.6s cubic-bezier(0.53, 0.21, 0, 1);
`;

const WrapperButton = styled(WalletMultiButton)`
  background-color: var(--color-primary);
  color: var(--color-black);
  box-shadow: var(--shadow-elevation-medium-primary);
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: var(--color-primary-light) !important;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 6px;
    transform: translate(-100%, -50%);
    width: 100%;
    height: 100%;
    background-color: var(--color-primary-dark);
    transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);
  }

  &:hover ${Span} {
    color: var(--color-white);
  }

  &:hover::before {
    transform: translate(0, -50%);
  }
`;

export default StyledWalletButton;
