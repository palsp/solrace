import styled from "styled-components";
import { AppImage, Paragraph } from "~/ui";
import Column from "../column";

interface Props {
  type: string;
}

const cardType = {
  kart: {
    img: "/kart-template.png",
    description: {
      model: "ZGMF-X42F Cassini",
      rarity: "AR",
      attributes: "Max Speed: 5",
      price: "5.43",
    },
  },
  garage: {
    img: "/garage-template.jpeg",
    description: {
      model: "ZX-00 Pegasus",
      rarity: "SSR",
      attributes: "Chances of Success: 88",
      price: "8.69",
    },
  },
};

const Card: React.FC<Props> = ({ type, children }) => {
  let card = cardType[type as keyof typeof cardType];
  return (
    <WrapperCard>
      <WrapperCardContent>
        <AppImage src={card.img} height="300px" width="350px" />
        <WrapperDescription>
          <TextDescription>
            <Paragraph>Model: {card.description.model}</Paragraph>
            <Paragraph>Rarity: {card.description.rarity}</Paragraph>
            <Paragraph>{card.description.attributes}</Paragraph>
          </TextDescription>
          <PriceDescription>
            <AppImage src="/sol-logo.png" width="25px" height="25px"></AppImage>
            <Paragraph>{card.description.price}</Paragraph>
          </PriceDescription>
        </WrapperDescription>
      </WrapperCardContent>
    </WrapperCard>
  );
};

const WrapperCard = styled(Column)`
  position: relative;
  overflow: hidden;
  width: clamp(200px, 100%, 350px);
  height: 100%;
  background: var(--color-white);
  box-shadow: var(--shadow-elevation-medium-secondary);
  gap: 1rem;
  border-radius: 0.5rem;

  &:hover {
    box-shadow: var(--shadow-elevation-high-secondary);
    cursor: pointer;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    background: var(--background-gradient-2);
    transition: all 0.5s ease-in;
  }
  &:hover::before {
    opacity: 1;
  }
`;

const WrapperCardContent = styled.div`
  // needs this or else the background will be on top
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WrapperDescription = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextDescription = styled.div``;
const PriceDescription = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default Card;
