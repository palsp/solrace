import React from "react";
import styled from "styled-components";
import { AppImage } from "~/ui";

const GameDetail = () => {
  return (
    <WrapperGameDetail>
      <WrapperContent>
        <TitleText>
          Explore the world where every conflicts can be resolved by racing!
        </TitleText>

        <WrapperFlex>
          <WrapperDescription>
            <TitleDescription>
              <Quote>
                &nbsp;&nbsp;&nbsp;&nbsp;"Humans are no strangers to wars. After
                all, we have been fighting for as long as we
                remember"&nbsp;&nbsp;
              </Quote>
              <QuoteAuthor>—Chairman Richard Prescott.</QuoteAuthor>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;Yet, we all know what happens in the
                after wars… casualties, damages, endless grief and bereavement.
                Same thing happened here in the Solraverse, a small village in
                Honshū comprising three powerful factions.
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
          <WrapperVideo>
            <VideoDiv>
              <Video src="/solrace-run.mp4" controls autoPlay></Video>
            </VideoDiv>
          </WrapperVideo>
        </WrapperFlex>
      </WrapperContent>
      <Star>&#10022;</Star>
    </WrapperGameDetail>
  );
};

const WrapperGameDetail = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/game-1.png");
  background-repeat: no-repeat;
  background-size: cover;
  color: var(--color-white);
`;
const WrapperContent = styled.div`
  padding: 3rem 4rem 3rem 4rem;
`;
const WrapperFlex = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 2rem;
  align-items: center;
  margin: 4.5rem 0;
`;

const WrapperDescription = styled.div`
  flex: 4;
`;
const WrapperVideo = styled.div`
  flex: 6;
  display: flex;
  align-items: center;
  /* & > * {
    box-shadow: var(--shadow-elevation-high-secondary);
  } */
  /* border-radius: 4rem; */
`;

const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 1.5rem;
  text-align: center;
`;

const Quote = styled.p`
  background: var(--color-secondary);
  color: var(--color-black);
  font-style: italic;
`;

const QuoteAuthor = styled.p`
  background: var(--color-secondary);
  width: max-content;
  margin-left: auto;
  padding-inline: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-black);
  font-style: italic;
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
const TitleDescription = styled.div`
  padding: 1rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-elevation-low-black);
`;
const Video = styled.video`
  /* min-width: 100%;
  min-height: 100%; */
`;
const VideoDiv = styled.div`
  background: red;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-elevation-medium-black);
`;
export default GameDetail;
