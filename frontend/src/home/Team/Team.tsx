import React from "react";
import styled from "styled-components";
import { AppImage } from "~/ui";
import Footer from "./Footer";

const Team = () => {
  return (
    <WrapperTeam>
      <Star>&#10022;</Star>

      <WrapperContent>
        <TitleText>Team</TitleText>

        <TeamDescription>
          <TeamPic>
            <AppImage src="/0xAkira.png" width="150px" height="150px" />
            <AppImage src="/0xReki.png" width="150px" height="150px" />
            <AppImage src="/0xYuna.png" width="150px" height="150px" />
            <AppImage src="/0xKazane.png" width="150px" height="150px" />
          </TeamPic>
          <TitleDescription>
            &emsp;One night at a famous Ramen shop in one of the busiest city in
            the world, a group of 4 crypto-enthusiast friends gather around for
            their long awaited casual catch up after the pandemic. Each was
            sharing their unexpected stories and hilarious moments in crypto
            space. One drink after another, the timeline of the talks was
            gradually traced back to the good old childhood days, reminiscenting
            their night playing Nintendo games. Despite being in the same group
            of friend, they all have different uniqueness in characters and
            talents in technical field. an unexpected thought popped up in
            0xAkira mind’s…, why don’t we start to BUIDL something? 0xReki
            replied, what would that be? 0xKazane raised, our mutual passion…?
            All four said simultaneously, “a crypto game!!!” followed by a
            limitless long laugh of an endless friendship…
          </TitleDescription>
        </TeamDescription>
      </WrapperContent>
      <Footer />
    </WrapperTeam>
  );
};

const WrapperTeam = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/team-background.png");
  flex: none;
  color: var(--color-white);
  position: relative;
`;
const WrapperContent = styled.div`
  padding: 3rem 2rem 0 2rem;
  height: 60%;
`;
const TeamDescription = styled.div`
  display: flex;
  justify-content: center;
`;
const TeamPic = styled.div`
  display: flex;
  /* max-width: 40%; */
  flex-wrap: wrap;
  justify-content: center;
  flex: 3.5;
  gap: 1rem;

  & > * {
    box-shadow: var(--shadow-elevation-medium-primary);
    border-radius: 1.5rem;
  }
`;
const TitleText = styled.h1`
  width: 100%;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;
`;

const TitleDescription = styled.p`
  padding: 1rem 1rem;
  flex: 6;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-elevation-low-black);
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
export default Team;
