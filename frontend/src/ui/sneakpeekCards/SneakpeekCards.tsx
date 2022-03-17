import React from "react";
import styled from "styled-components";
import { AppImage, Column, Model3D, Paragraph } from "~/ui";
import AbilityCard from "./AbilityCard/AbilityCard";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

interface Props {
  type: string;
}
const SneakpeekCards: React.FC<Props> = ({ type }) => {
  if (type === "abilities") {
    return (
      <WrapperCard>
        <TitleDiv>
          <h2>Explore the Abilities</h2>
        </TitleDiv>
        <WrapperCarousel>
          <Carousel
            infiniteLoop
            //   autoPlay
            emulateTouch
            showArrows={false}
            showStatus={false}
            showThumbs={false}
          >
            <AbilityCard type="hack" />
            <AbilityCard type="missile" />
            <AbilityCard type="swap" />
            <AbilityCard type="berserk" />
            <AbilityCard type="reinforce" />
            <AbilityCard type="arcTrap" />
          </Carousel>
        </WrapperCarousel>
      </WrapperCard>
    );
  }
  if (type === "models") {
    return (
      <WrapperCard>
        <TitleDiv>
          <h2>Test drive our karts</h2>
        </TitleDiv>
        <WrapperCarousel>
          <Carousel
            infiniteLoop
            //   autoPlay
            showArrows={false}
            showStatus={false}
            showThumbs={false}
          >
            <Model3D model="Cassini" height="380px" />
            <Model3D model="Voyager" height="380px" />
            <Model3D model="Ariel" height="380px" />
          </Carousel>
        </WrapperCarousel>
      </WrapperCard>
    );
  }
  return "";
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
  display: flex;
  transition: box-shadow 1s ease;
  &:hover {
    box-shadow: var(--shadow-elevation-high-secondary);
  }
`;
const WrapperCarousel = styled.div`
  width: 100%;
  height: 100%;
`;
const TitleDiv = styled.div`
  background: var(--background-gradient-1);
  width: 100%;
  padding: 1rem;
  text-align: center;
`;
export default SneakpeekCards;
