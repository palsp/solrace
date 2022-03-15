import React from "react";
import HorizontalScroll from "react-scroll-horizontal";
import styled from "styled-components";
import HomeNav from "~/app/HomeNav";
import { Trailer, GameDetail, GamePlay } from "~/home";

const home = () => {
  return (
    <div style={{ width: `100vw`, height: `100%`, overflow: "auto" }}>
      <HorizontalScroll>
        <HomeNav />
        <Trailer />
        <GameDetail />
        <GamePlay />
      </HorizontalScroll>
    </div>
  );
};

export default home;
