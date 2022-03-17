import React from "react";
import styled from "styled-components";
import SneakpeekCards from "~/ui/sneakpeekCards";
const Sneakpeek = () => {
  return (
    <WrapperSneakpeek>
      <WrapperContent>
        <TitleText>Ace the race with your perfect combinations</TitleText>
        <WrapperCards>
          <SneakpeekCards type="models" />
          <SneakpeekCards type="abilities" />
          <SneakpeekCards type="video" />
        </WrapperCards>
      </WrapperContent>
      <Star>&#10022;</Star>
    </WrapperSneakpeek>
  );
};
const WrapperSneakpeek = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/game-3.png");
  background-repeat: no-repeat;
  background-size: cover;
`;
const WrapperContent = styled.div`
  padding: 3rem 1rem 3rem 4rem;
`;
const WrapperCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  width: 90%;
  margin: 4.5rem auto;
`;
const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 1.5rem;

  text-align: center;
  width: 100%;
  color: var(--color-white);
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
export default Sneakpeek;
