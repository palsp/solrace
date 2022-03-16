import React from "react";
import styled from "styled-components";
import { AppImage } from "~/ui";

const GameDetail = () => {
  return (
    <WrapperGameDetail>
      <WrapperContent>
        <WrapperDescription>
          <TitleText>Explore the world where every conflicts...</TitleText>
          <TitleDescription>
            <Quote>
              &nbsp;&nbsp;&nbsp;&nbsp;"Humans are no strangers to wars. After
              all, we have been fighting for as long as we remember"&nbsp;&nbsp;
            </Quote>
            <QuoteAuthor>
              <i> —Chairman Richard Prescott.</i>
            </QuoteAuthor>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;Yet, we all know what happens in the after
              wars… casualties, damages, endless grief and bereavement. Same
              thing happened here in the Solraverse, a small village in Honshū
              comprising three powerful factions.
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp; While the earth was celebrating the
              successful launch of Super Mario kart in 1992, Solraverse was
              experiencing its greatest nightmare; the greatest war of San
              Tairitsu 三対立. Villagers are battling for its faction to rule
              the village like usual. Except that this time, things are
              different ...
            </p>
          </TitleDescription>
        </WrapperDescription>
        <WrapperImage>
          <AppImage
            src="/garage-template.jpeg"
            height="80%"
            border="0.5rem"
          ></AppImage>
        </WrapperImage>
      </WrapperContent>
      <Star>&#10022;</Star>
    </WrapperGameDetail>
  );
};

const WrapperGameDetail = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-1);
`;
const WrapperContent = styled.div`
  display: flex;
  padding: 3rem 4rem;
  gap: 2rem;
`;
const WrapperDescription = styled.div`
  flex: 4;
`;
const WrapperImage = styled.div`
  flex: 6;
  display: flex;
  align-items: center;
  /* border-radius: 4rem; */
`;

const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
`;

const Quote = styled.p`
  background: var(--color-primary);
`;

const QuoteAuthor = styled.p`
  background: var(--color-primary);
  width: max-content;
  margin-left: auto;
  padding-inline: 0.5rem;
  margin-bottom: 1rem;
`;
const Star = styled.div`
  position: fixed;
  z-index: 2;
  top: calc(50vh - 128px);
  transform: translateX(-50%);
  color: var(--color-secondary-light);
  opacity: 0.8;
  border-radius: 50rem;
  font-size: 128px;
  box-shadow: var(--shadow-elevation-high-primary);
  background: var(--background-gradient-2);
`;
const TitleDescription = styled.div``;

export default GameDetail;
