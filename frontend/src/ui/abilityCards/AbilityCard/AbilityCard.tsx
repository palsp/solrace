import React from "react";
import styled from "styled-components";
import { AppImage, Column, Paragraph } from "~/ui";

interface Props {
  type?: string;
}
const abilities = {
  arcTrap: {
    url: "/arctrap-v1.png",
    description: `They say you suck? Suck them then! ...
    Deploy a gravitational trap the deal small damage and pull the opponent to the center of the trap.`,
  },
  berserk: {
    url: "/berserk-v1.png",
    description: `Feel the thrill? Rev up your engine and go wild! Increase the speed of your car and deal damage upon hitting other opponents for a short period of time.`,
  },
  missile: {
    url: "/missile-v1.png",
    description: `Slippery opponents? Let’s see  if they can outrun this! Launch a missile that will be guided to nearest opponent, dealing damage and stagger on impact.`,
  },
  hack: {
    url: "/hack-v1.png",
    description: `They say you suck? Suck them then! ...
      Deploy a gravitational trap the deal small damage and pull the opponent to the center of the trap.`,
  },
  reinforce: {
    url: "/reinforce-v1.png",
    description: `Extra layer of protection is always a good thing! Ignore and block the ability skill inflicts on the user.`,
  },
  swap: {
    url: "/swap-v1.png",
    description: `Extra layer of protection is always a good thing! Ignore and block the ability skill inflicts on the user.`,
  },
};

const AbilityCard: React.FC<Props> = ({ type }) => {
  const abilityCard = abilities[type as keyof typeof abilities];
  return (
    <WrapperAbilityCard>
      <AppImage src={abilityCard?.url} height="200px" width="200px" />
      <Paragraph>{abilityCard?.description}</Paragraph>
    </WrapperAbilityCard>
  );
};

const WrapperAbilityCard = styled.div`
  background: var(--background-gradient-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem 2rem;
  min-height: 380px;
  /* opacity: 0.8; */
`;

export default AbilityCard;
