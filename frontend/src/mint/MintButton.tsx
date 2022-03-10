import styled from 'styled-components';
import { CandyMachineAccount } from '~/api/solana/candy-machine';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '~/ui/';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';

import ReactLoading from 'react-loading';

export const CTAButton = styled(Button)`
  width: 30%;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`; // add your own styles here

interface Props {
  candyMachine?: CandyMachineAccount;
  isMinting: boolean;
  isActive: boolean;
  onMint: () => Promise<void>;
}

const MintButton: React.FC<Props> = ({
  onMint,
  candyMachine,
  isMinting,
  isActive,
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    setClicked(true);
    if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
      if (gatewayStatus === GatewayStatus.ACTIVE) {
        setClicked(true);
      } else {
        await requestGatewayToken();
      }
    } else {
      await onMint();
      setClicked(false);
    }
  };

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const buttonContent = useMemo(() => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    } else if (
      candyMachine?.state.isPresale ||
      candyMachine?.state.isWhitelistOnly
    ) {
      return 'WHITELIST MINT';
    } else if (clicked && candyMachine?.state.gatekeeper) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    }

    return 'MINT';
  }, [clicked, isMinting, candyMachine]);

  return (
    <CTAButton
      type="button"
      disabled={clicked || isMinting || !isActive}
      onClick={handleClick}
      color="primary"
    >
      {buttonContent}
    </CTAButton>
  );
};

export default MintButton;
