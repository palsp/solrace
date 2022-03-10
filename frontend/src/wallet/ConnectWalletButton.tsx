import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from "styled-components";

const StyledWalletMultiButton = styled(WalletMultiButton)`
  background-color: var(--color-secondary);
  color: var(--color-black);
  box-shadow: var(--shadow-elevation-medium-secondary);

  &:hover {
    background-color: var(--color-secondary-dark) !important;
  }
`;

export default StyledWalletMultiButton;
