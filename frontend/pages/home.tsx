import React from "react";
import styled from "styled-components";
import HomeNav from "~/app/HomeNav";
import Trailer from "~/home/Trailer";

const home = () => {
  return (
    <div>
      <HomeNav />
      <Trailer />
    </div>
  );
};

export default home;
