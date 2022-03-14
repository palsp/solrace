import styled from "styled-components";
import AppLayout from "~/app/AppLayout";

interface Props {
  direction: string;
  tokenDetail?: any;
  token3D?: any;
}

const TokenDetailLayout: React.FC<Props> = ({
  direction,
  tokenDetail,
  token3D,
}) => {
  return (
    <AppLayout>
      <TokenDetailLayoutContainer direction={direction}>
        <Wrapper3D>{token3D}</Wrapper3D>
        <WrapperTokenDetail>{tokenDetail}</WrapperTokenDetail>
      </TokenDetailLayoutContainer>
    </AppLayout>
  );
};

const TokenDetailLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props: Props) => props.direction};
`;

const Wrapper3D = styled.div`
  flex: 4;
`;

const WrapperTokenDetail = styled.div`
  flex: 6;
  background: yellow;
`;
export default TokenDetailLayout;
