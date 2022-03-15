import React from "react";
import styled from "styled-components";
const Team = () => {
  return <WrapperTeam>Team</WrapperTeam>;
};

const WrapperTeam = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-1-flipped);
  scroll-snap-align: start;
  flex: none;
`;
export default Team;
