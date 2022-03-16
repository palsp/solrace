import React from "react";
import styled from "styled-components";
import { AppImage } from "~/ui";

const Roadmap = () => {
  return (
    <WrapperRoadmap>
      <Star>&#10022;</Star>
      <WrapperImage>
        <AppImage
          src="/roadmap-track.png"
          width="100vw"
          height="350px"
          style={{ cursor: "pointer", marginBottom: "0.5rem" }}
        />
      </WrapperImage>
      <FirstQuarter>
        <Paragraph>Q1 2022</Paragraph>
        <ul>
          <li>Game concept development</li>
          <li>Website launch</li>
          <li>Communication channel launch</li>
          <li>Solana Riptide Hackathon</li>
        </ul>
      </FirstQuarter>
      <SecondQuarter>
        <p style={{ marginLeft: "3rem" }}>Q2 2022</p>
        <ul>
          <li>Game mechanics development</li>
          <li>Tokenomics: $SOLR & $NITRO</li>
          <li>Community building</li>
          <li>Partner and investor network expansion</li>
        </ul>
      </SecondQuarter>
      <ThirdQuarter>
        <Paragraph>Q3 2022</Paragraph>
        <ul>
          <li>Genesis kart and garage NFT release</li>
          <li>Internal test</li>
        </ul>
      </ThirdQuarter>
      <FourthQuarter>
        <Paragraph>Q4 2022</Paragraph>
        <ul>
          <li>Genesis kart and garage sale</li>
          <li>Market place launch</li>
          <li>Beta test </li>
        </ul>
      </FourthQuarter>
      <FutureQuarter>
        <Paragraph>Long ride ahead are yet to be discoverd...</Paragraph>
      </FutureQuarter>
      <WrapperContent>
        <TitleText>Roadmap</TitleText>
        <TitleDescription>
          Unlike racers rushing for the finish line, we instead believe in
          endless growth and continuous development. SolRace development
          approach will be divided into small, yet meaningful milestones like
          pitstops that allows the team and community to take a step to refuel
          and together revise mechanical adjustment for the greatest
          sustainability to our community
        </TitleDescription>
      </WrapperContent>
    </WrapperRoadmap>
  );
};

const WrapperRoadmap = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/roadmap-background.png");
  color: var(--color-white);
  position: relative;
`;
const WrapperContent = styled.div`
  padding: 3rem 6rem;
`;
const FirstQuarter = styled.div`
  position: absolute;
  top: 42%;
  left: 5%;
`;
const Paragraph = styled.p`
  text-align: center;
`;
const SecondQuarter = styled.div`
  position: absolute;
  top: 72%;
  left: 25%;
`;
const ThirdQuarter = styled.div`
  position: absolute;
  top: 42%;
  left: 40%;
`;
const FourthQuarter = styled.div`
  position: absolute;
  top: 42%;
  left: 73.5%;
`;
const FutureQuarter = styled.div`
  position: absolute;
  top: 90%;
  left: 80%;
`;

const WrapperQuarter = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  text-align: center;

  & > * {
    flex: 1;
  }
`;
const WrapperImage = styled.div`
  position: absolute;
  left: 0;
  top: 45%;
`;
const TitleText = styled.h1`
  width: 100%;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;
`;

const TitleDescription = styled.p``;

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
export default Roadmap;
