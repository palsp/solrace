import React from "react";
import HorizontalScroll from "react-scroll-horizontal";
import styled from "styled-components";
import HomeNav from "~/app/HomeNav";
import GameDetail from "~/home/GameDetail";
import Trailer from "~/home/Trailer";

const home = () => {
  return (
    <div style={{ width: `100vw`, height: `100%`, overflow: "auto" }}>
      <HorizontalScroll>
        <HomeNav />
        <Trailer />
        <GameDetail />
      </HorizontalScroll>
    </div>
  );
};

export default home;
