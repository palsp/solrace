import styled from "styled-components";
import AppLayout from "~/app/AppLayout";

interface Props {
  direction: string;
  token3D?: any;
}

const TokenDetailLayout: React.FC<Props> = ({
  direction,
  token3D,
  children,
}) => {
  return (
    <AppLayout>
      <TokenDetailLayoutContainer direction={direction}>
        <Wrapper3D>
          <WrapperInner3D>{token3D}</WrapperInner3D>
        </Wrapper3D>
        <WrapperTokenDetail>{children}</WrapperTokenDetail>
      </TokenDetailLayoutContainer>
    </AppLayout>
  );
};

const TokenDetailLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props: Props) => props.direction};
  gap: 1rem;
`;

const Wrapper3D = styled.div`
  flex: 4;
`;

const WrapperInner3D = styled.div`
  width: 80%;
  margin: auto;
`;
const WrapperTokenDetail = styled.div`
  flex: 6;
  /* height: 75%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const WrapperCard = styled.div`
  /* background: var(--color-primary-light); */

  border-radius: 0.5rem;
  padding: 1rem;

  width: fit-content;
`;
export default TokenDetailLayout;
