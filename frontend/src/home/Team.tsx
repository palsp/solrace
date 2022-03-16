import React from "react";
import styled from "styled-components";

const Team = () => {
  return (
    <WrapperTeam>
      <Star>&#10022;</Star>
    </WrapperTeam>
  );
};

const WrapperTeam = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-1-flipped);
  scroll-snap-align: start;
  flex: none;
`;

const Star = styled.div`
  position: fixed;
  z-index: 2;
  top: calc(50vh - 128px);
  transform: translateX(-50%);
  color: var(--color-secondary-light);
  opacity: 0.8;
  border-radius: 50rem;
  font-size: 128px;
  box-shadow: var(--shadow-elevation-high-primary);
  background: var(--background-gradient-2);
`;
export default Team;
