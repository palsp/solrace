import React from "react";
import styled from "styled-components";
import { Button, Model3D } from "~/ui";

const GamePortal = () => {
  return (
    <WrapperGamePortal>
      <WrapperContent>
        <TitleText>Are you ready for an all-out race?</TitleText>
        <WrapperItems>
          <WrapperItem>
            <h3>Own the garage</h3>
            {/* <Model3D height="65vh" model="Apollo" /> */}
            <FirstCardContent>
              <CardDescription>
                An exclusive 888 plots of garage plays an important role in
                Solrace economic chain as a solid kart performance boost could
                destine solracers’ success in the ride. Become the owner of
                these garages to earn passive income via a fair share of upgrade
                fee
              </CardDescription>
              <Button color="primary">View Garage</Button>
            </FirstCardContent>
          </WrapperItem>
          <WrapperItem>
            <h3>Get your Solakart</h3>
            {/* <Model3D height="65vh" model="Cassini" /> */}

            <SecondCardContent>
              <CardDescription>
                It is not only about the speed or raw heat of competition that
                matters; but the design. A unique 8,888 Genesis Solakarts are
                ready to onboard all solracers for an immersive race
              </CardDescription>
              <Button color="primary">Browse solakart</Button>
            </SecondCardContent>
          </WrapperItem>
          <WrapperItem>
            <h3>Explore the Solravese</h3>
            {/* <Model3D height="65vh" model="Ariel" /> */}
            <ThirdCardContent>
              <CardDescription>
                There are so much more in the Solraverse... Not limited to only
                the enjoyment from the ride, solracers and garage owners could
                boost their benefits and earn governace rights via $SOLR staking
              </CardDescription>
              <Button color="primary"> $SOLR staking</Button>
            </ThirdCardContent>
          </WrapperItem>
        </WrapperItems>
      </WrapperContent>
      <Star>&#10022;</Star>
    </WrapperGamePortal>
  );
};
const WrapperGamePortal = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/game-2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: var(--color-white);
`;
const WrapperContent = styled.div`
  padding: 3rem 1rem;
`;
const WrapperItems = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  width: 90%;
  margin: 4.5rem auto;
`;
const WrapperItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 300px;
  gap: 1rem;
`;

const CardContent = styled.div`
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 400px;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.9rem;
  text-align: center;
  color: var(--color-white);
  box-shadow: var(--shadow-elevation-medium-secondary);
  transition: box-shadow 1s ease;
  &:hover {
    box-shadow: var(--shadow-elevation-high-secondary);
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }
`;

const CardDescription = styled.p`
  position: relative;
  padding: 0.25rem 0.15rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-elevation-low-black);
`;
const FirstCardContent = styled(CardContent)`
  &::before {
    background: url("/game-1.png");
    background-position: center;
  }
`;
const SecondCardContent = styled(CardContent)`
  &::before {
    background: url("/game-2.png");
    background-position: center;
  }
`;
const ThirdCardContent = styled(CardContent)`
  &::before {
    background: url("/game-3.png");
    background-position: center;
  }
`;

const TitleText = styled.h1`
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 1.5rem;

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
export default GamePortal;
