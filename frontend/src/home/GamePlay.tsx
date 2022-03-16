import React from "react";
import styled from "styled-components";
import { Model3D } from "~/ui";

const GamePlay = () => {
  return (
    <WrapperGamePlay>
      <WrapperContent>
        <TitleText>Are you ready for an all-out race?</TitleText>
        <WrapperItems>
          <WrapperItem>
            <p>Own the garage</p>
            <Model3D height="65vh" model="Apollo" />
          </WrapperItem>
          <WrapperItem>
            <p>Choose your kart</p>
            <Model3D height="65vh" model="Cassini" />
          </WrapperItem>
          <WrapperItem>
            <p>Drop your weapons</p>
            <Model3D height="65vh" model="Ariel" />
          </WrapperItem>
        </WrapperItems>
      </WrapperContent>
      {/* <Star>&#10022;</Star> */}
    </WrapperGamePlay>
  );
};
const WrapperGamePlay = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-2-flipped);
`;
const WrapperContent = styled.div`
  padding: 3rem 1rem;
`;
const WrapperItems = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  width: 90%;
  margin: 0 auto;
  /* margin-bottom: 5rem; */
`;
const WrapperItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;
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
export default GamePlay;
