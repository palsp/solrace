import React from "react";
import styled from "styled-components";
import { AppImage, Button } from "~/ui";

const Trailer = () => {
  return (
    <WrapperTrailer>
      <SocialDiv>
        <AppImage src="/twitter.png" width="34px" height="34px" />
        <AppImage src="/discord.png" width="34px" height="34px" />
        <AppImage src="/telegram.png" width="34px" height="34px" />
        <AppImage src="/medium.png" width="34px" height="34px" />
      </SocialDiv>
      <VideoWrapper>
        <Video src="/solrace-map.mp4" controls autoPlay></Video>
      </VideoWrapper>
      <TitleDiv>
        <TitleText>Drop your kart !</TitleText>
        <TitleDescription>
          Ace the race with your speed in a world where everything conflicts
          decided by racing, not wars..
        </TitleDescription>
        <Button color="primary" width="200px" padding="0.75rem">
          Start
        </Button>
      </TitleDiv>
      <InputDiv></InputDiv>
    </WrapperTrailer>
  );
};

const WrapperTrailer = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
`;

const TitleDiv = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 800px;
  height: 300px;
  margin: auto;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const TitleText = styled.h1`
  font-weight: 400;
  font-size: 3rem;
`;
const TitleDescription = styled.p``;

const SocialDiv = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  height: 180px;
  margin: auto 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  & > * {
    cursor: pointer;
  }
`;

const InputDiv = styled.div``;
const VideoWrapper = styled.div`
  /* margin-left: -3rem; */
  position: absolute;
  top: 0;
  left: 0;
  max-height: 100%;
  width: 100vw;
  /* height: 90%; */
`;
const Video = styled.video`
  min-width: 100vw;
  min-height: 100%;
`;
export default Trailer;
