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
            {/* <p>Own the garage</p> */}
            <Model3D height="65vh" model="Apollo" />
          </WrapperItem>
          <WrapperItem>
            {/* <p>Choose your kart</p> */}
            <Model3D height="65vh" model="Cassini" />
          </WrapperItem>
          <WrapperItem>
            {/* <p>Drop your weapons</p> */}
            <Model3D height="65vh" model="Ariel" />
          </WrapperItem>
        </WrapperItems>
      </WrapperContent>
    </WrapperGamePlay>
  );
};
const WrapperGamePlay = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background-gradient-1);
`;
const WrapperContent = styled.div`
  padding: 3rem 4rem;
`;
const WrapperItems = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  /* margin-bottom: 5rem; */
`;
const WrapperItem = styled.div`
  display: flex;
  flex-direction: column;
`;
const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;
`;

export default GamePlay;
