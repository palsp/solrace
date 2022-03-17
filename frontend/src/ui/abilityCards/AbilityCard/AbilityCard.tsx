import React from "react";
import styled from "styled-components";
import { AppImage, Column, Paragraph } from "~/ui";

const AbilityCard = () => {
  return (
    <WrapperCard>
      <TitleDiv>
        <h2>Explore the Abilities</h2>
      </TitleDiv>
      <TextDescription>
        <WrapperAbility>
          <AppImage src="/swap-v1.png" height="200px" width="200px" />
          <Paragraph>
            Bored from watching your opponents rear? Then let them watch yours
            instead! After a short delay, switch the position of the opponent
            that has higher place with you.
          </Paragraph>
        </WrapperAbility>
      </TextDescription>
    </WrapperCard>
  );
};

const WrapperCard = styled(Column)`
  position: relative;
  overflow: hidden;
  width: clamp(200px, 100%, 400px);
  height: 100%;
  background: var(--color-white);
  box-shadow: var(--shadow-elevation-medium-secondary);
  /* gap: 1rem; */
  border-radius: 0.5rem;
  &:hover {
    /* box-shadow: var(--shadow-elevation-high-secondary); */
  }
`;
const WrapperAbility = styled.div`
  background: var(--background-gradient-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;
const TitleDiv = styled.div`
  background: var(--background-gradient-1);
  width: 100%;
  padding: 1rem;
  text-align: center;
`;
const TextDescription = styled.div`
  text-align: center;
`;

export default AbilityCard;
