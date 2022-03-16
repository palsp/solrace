import React from "react";
import styled from "styled-components";
import { Button, Model3D } from "~/ui";

const GamePlay = () => {
  return (
    <WrapperGamePlay>
      <WrapperContent>
        <TitleText>Are you ready for an all-out race?</TitleText>
        <WrapperItems>
          <WrapperItem>
            <p>Own the garage</p>
            {/* <Model3D height="65vh" model="Apollo" /> */}
            <FirstCardContent>
              <p>
                An exclusive 888 plots of garage plays an important role in
                Solrace economic chain as a solid kart performance boost could
                destine solracers’ success in the ride. Become the owner of
                these garages to earn passive income via a fair share of upgrade
                fee
              </p>
              <Button color="primary">View Garage</Button>
            </FirstCardContent>
          </WrapperItem>
          <WrapperItem>
            <p>Get your Solakart</p>
            {/* <Model3D height="65vh" model="Cassini" /> */}

            <SecondCardContent>
              <p>
                It is not only about the speed or raw heat of competition that
                matters; but the design. A unique 8,888 Genesis Solakarts are
                ready to onboard all solracers for an immersive race
              </p>
              <Button color="primary">Browse solakart</Button>
            </SecondCardContent>
          </WrapperItem>
          <WrapperItem>
            <p>Explore the Solravese</p>
            {/* <Model3D height="65vh" model="Ariel" /> */}
            <ThirdCardContent>
              <p>
                There are so much more in the Solraverse... Not limited to only
                the enjoyment from the ride, solracers and garage owners could
                boost their benefits and earn governace rights via $SOLR staking
              </p>
              <Button color="primary"> $SOLR staking</Button>
            </ThirdCardContent>
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
  flex: 1;
  max-width: 300px;
  gap: 1rem;
`;

const CardContent = styled.div`
  position: relative;
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
  box-shadow: var(--shadow-elevation-medium-black);
`;

const FirstCardContent = styled(CardContent)`
  background: url("/game-1.png");
  background-position: center;
`;
const SecondCardContent = styled(CardContent)`
  background: url("/game-2.png");
  background-position: center;
`;
const ThirdCardContent = styled(CardContent)`
  background: url("/game-3.png");
  background-position: center;
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
