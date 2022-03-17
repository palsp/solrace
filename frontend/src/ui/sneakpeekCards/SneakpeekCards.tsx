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
          <h2>Explore the abilities</h2>
        </TitleDiv>
        <WrapperCarousel>
          <Carousel
            infiniteLoop
            autoPlay
            emulateTouch
            // showArrows={false}
            showStatus={false}
            showThumbs={false}
            interval={4500}
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
          <h2>Choose your karts</h2>
        </TitleDiv>
        <WrapperCarousel>
          <Carousel
            autoPlay
            // showArrows={false}
            showStatus={false}
            showThumbs={false}
            interval={4500}
          >
            <ModelDiv>
              <Model3D model="Cassini" height="425px" />
              <ModelH5>ZGNF-X42F Takahashi</ModelH5>
            </ModelDiv>
            <ModelDiv>
              <Model3D model="Apollo" height="425px" />
              <ModelH5>ARB-01 Nakajima</ModelH5>
            </ModelDiv>

            <ModelDiv>
              <Model3D model="Ariel" height="425px" />
              <ModelH5>RX-39 Suzuki</ModelH5>
            </ModelDiv>
            <ModelDiv>
              <Model3D model="Voyager" height="425px" />
              <ModelH5>GMW-00X Sato</ModelH5>
            </ModelDiv>
            <ModelDiv>
              <Model3D model="Venera" height="425px" />
              <ModelH5>ASW-K-78F Hasemi</ModelH5>
            </ModelDiv>

            {/* <Model3D model="Ariel" height="380px" /> */}
          </Carousel>
        </WrapperCarousel>
      </WrapperCard>
    );
  }
  if (type === "video") {
    return (
      <WrapperCard>
        <TitleDiv>
          <h2>Limitless possibilities</h2>
        </TitleDiv>
        <WrapperCarousel>
          <Carousel
            infiniteLoop
            autoPlay
            emulateTouch
            // showArrows={false}
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            interval={4500}
          >
            <VideoDiv>
              <h5>Ability - ARCTRAP</h5>

              <Video
                src="/arctrap-showcase-ns-com.mp4"
                controls
                autoPlay
              ></Video>
            </VideoDiv>
            <VideoDiv>
              <h5>Ability - HACK</h5>

              <Video src="/hack-showcase-ns-com.mp4" controls autoPlay></Video>
            </VideoDiv>
            <VideoDiv>
              <h5>Ability - HOMING</h5>

              <Video
                src="/homing-showcase-ns-com.mp4"
                controls
                autoPlay
              ></Video>
            </VideoDiv>
            <VideoDiv>
              <h5>Ability - BERSERK</h5>

              <Video
                src="/berserk-showcase-ns-com.mp4"
                controls
                autoPlay
              ></Video>
            </VideoDiv>
            <VideoDiv>
              <h5>Ability - REINFORCE</h5>

              <Video
                src="/reinforce-showcase-ns-com.mp4"
                controls
                autoPlay
              ></Video>
            </VideoDiv>
          </Carousel>
        </WrapperCarousel>
      </WrapperCard>
    );
  }
  return <></>;
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
    cursor: pointer;
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

const ModelDiv = styled.div`
  position: relative;
`;

const ModelH5 = styled.h5`
  position: absolute;
  top: 15%;
  left: 0px;
  right: 0px;
  font-style: italic;
`;
const Video = styled.video`
  /* min-width: 100%;
min-height: 100%; */
`;
const VideoDiv = styled.div`
  background: var(--background-gradient-2);
  overflow: hidden;
  box-shadow: var(--shadow-elevation-medium-black);
  min-height: 425px;
  padding: 0rem 0rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  & > h5 {
    /* margin-bottom: 1rem; */
  }
`;
export default SneakpeekCards;
