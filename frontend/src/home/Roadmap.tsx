import React from "react";
import styled from "styled-components";

const Roadmap = () => {
  return (
    <WrapperRoadmap>
      <Star>&#10022;</Star>
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
        <WrapperQuarter>
          <div>
            <p>Q1 2022</p>
          </div>
          <div>
            <p>Q2 2022</p>
          </div>
          <div>
            <p>Q3 2022</p>
          </div>
          <div>
            <p>Q4 2022</p>
          </div>
          <div>
            <p>2023 Onwards</p>
            <p>
              Long ride ahead are yet to be discoverd... SolRace team strives to
              build a future of blockchain game that the main focus is a
              functional and sustainable community in which benefits are
              realized to all types of stakeholders.{" "}
            </p>
          </div>
        </WrapperQuarter>
      </WrapperContent>
    </WrapperRoadmap>
  );
};

const WrapperRoadmap = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-1);
`;
const WrapperContent = styled.div`
  padding: 3rem 6rem;
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
const TitleText = styled.h1`
  width: 100%;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;
  color: black;
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
