import React from "react";
import styled from "styled-components";
import AppLayout from "~/app/AppLayout";
import { Filter } from "~/ui";

interface Props {
  direction: string;
  cards?: JSX.Element | undefined;
  page: string;
}
const InventoryLayout: React.FC<Props> = ({
  direction,
  page,
  children,
  cards,
}) => {
  return (
    <AppLayout>
      <InventoryLayoutContainer direction={direction} page={page}>
        <WrapperDescription>
          {children}

          <Filter page={page} />
        </WrapperDescription>
        <WrapperCards>{cards}</WrapperCards>
      </InventoryLayoutContainer>
    </AppLayout>
  );
};

const InventoryLayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props: Props) => props.direction};
  gap: 1rem;
`;

const WrapperDescription = styled.div`
  flex: 3;
  margin: 2rem 0;
`;

const WrapperCards = styled.div`
  flex: 7;
  margin: 2rem 0;
`;
export default InventoryLayout;
