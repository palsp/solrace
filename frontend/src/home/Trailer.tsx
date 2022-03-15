import React from "react";
import styled from "styled-components";

const Trailer = () => {
  return (
    <VideoWrapper>
      <Video src="/solrace-map.mp4" controls></Video>
    </VideoWrapper>
  );
};
const VideoWrapper = styled.div`
  /* margin-left: -3rem; */
  position: absolute;
  top: 0;
  left: 0;
  max-height: 100%;
  width: 100%;
  /* height: 90%; */
`;
const Video = styled.video`
  min-width: 100%;
  min-height: 100%;
`;
export default Trailer;
