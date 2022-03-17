import React from "react";
import HorizontalScroll from "react-scroll-horizontal";
import styled from "styled-components";
import {
  Trailer,
  GameDetail,
  GamePlay,
  Roadmap,
  Team,
  HomeNav,
  Sneakpeek,
} from "~/home";

const home = () => {
  return (
    // <div style={{ width: `100vw`, height: `100%`, overflow: "auto" }}>
    <HorizontalScroll>
      <HomeNav />
      <Trailer />
      <GameDetail />
      <GamePlay />
      <Sneakpeek />
      <Roadmap />
      <Team />
    </HorizontalScroll>
    // </div>
  );
};

export default home;
