import React from "react";
import styled from "styled-components";
import { AppImage, Button, Input } from "~/ui";
import { Bell } from "react-feather";
import Link from "next/link";

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
        <Video src="/solrace-map-s-com.mp4" controls autoPlay></Video>
      </VideoWrapper>
      <TitleDiv>
        <TitleText>Drop your kart !</TitleText>
        <TitleDescription>
          Ace the race with your speed in a world where everything conflicts
          decided by racing, not wars..
        </TitleDescription>
        <Link href="/app">
          <a>
            <Button color="primary" width="200px" padding="0.75rem">
              Start
            </Button>
          </a>
        </Link>
      </TitleDiv>
      <InputDiv>
        <WrapperInput>
          <Input placeholder="Enter your email address... " />
          <IconWrapper size="24px">
            <Bell />
          </IconWrapper>
        </WrapperInput>
      </InputDiv>
    </WrapperTrailer>
  );
};

const WrapperTrailer = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
  overflow: hidden;
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

const InputDiv = styled.div`
  position: absolute;
  z-index: 1;
  top: 70%;
  left: 0;
  right: 0;
  width: 400px;
  margin-inline: auto;
`;

const WrapperInput = styled.div`
  position: relative;
`;

const VideoWrapper = styled.div`
  /* margin-left: -3rem; */
  position: absolute;
  top: 0;
  left: -25px;
  max-height: 100%;
  width: 100vw;
  /* height: 90%; */
`;
const Video = styled.video`
  min-width: 111.5vw;
  /* min-height: 20vh; */
`;

interface Props {
  size?: string;
}
const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  display: inline-block;
  width: ${(props: Props) => props.size};
  height: ${(props: Props) => props.size};
  margin: 0 0.2rem;
  pointer-events: none;
`;

export default Trailer;
