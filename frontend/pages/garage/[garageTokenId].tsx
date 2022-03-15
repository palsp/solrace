import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";
import {
  Model3D,
  ParagraphItalic,
  ParagraphItalicBold,
  Select,
  Title,
} from "~/ui";
import { usePool } from "~/pool/hooks";
import { Star, Award, DollarSign, Shield, Activity } from "react-feather";

const GarageDetail = () => {
  const { query, isReady } = useRouter();
  const { garageTokenId: tokenId } = query;
  const { poolInfo, apr } = usePool();

  return (
    <TokenDetailLayout
      direction="row-reverse"
      token3D={<Model3D model="Apollo" />}
    >
      <TitleDiv>
        <Title fontStyle="italic">ZX-00 Pegasus</Title>
        <h3>APR - {apr}% </h3>

        <ParagraphItalic>ID: {tokenId}</ParagraphItalic>
        <ParagraphItalic>
          Owner: BuxRVqu8YndicdXV4KLXBR451GUug63BkgaVEgwpDwYA
        </ParagraphItalic>
      </TitleDiv>

      <AbilityDiv>
        <StatsDiv>
          <StatsDiv1>
            <ParagraphItalicBold>
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Star />
              </IconWrapper>
              Rarity: SS
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Award />
              </IconWrapper>
              Success: 88%
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <DollarSign />
              </IconWrapper>
              Price: 86
            </ParagraphItalicBold>
          </StatsDiv1>
          <StatsDiv2>
            <ParagraphItalicBold>
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Shield />
              </IconWrapper>
              Fame: 7
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper style={{ "--size": 18 + "px" }}>
                <Activity />
              </IconWrapper>
              Reputation: 6
            </ParagraphItalicBold>
          </StatsDiv2>
        </StatsDiv>
      </AbilityDiv>
    </TokenDetailLayout>
  );
};

const TitleDiv = styled.div`
  /* background: var(--color-primary-light); */
  width: fit-content;
  border-radius: 0.5rem;
  gap: 2rem;
`;

const AbilityDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const StatsDiv = styled.div`
  background-color: var(--color-secondary-light);
  color: var(--color-black);
  width: 350px;
  padding: 0.5rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  display: flex;
  align-items: end;
  gap: 2rem;
`;

const StatsDiv1 = styled.div``;
const StatsDiv2 = styled.div``;

const IconWrapper = styled.div`
  display: inline-block;
  width: var(--size);
  height: var(--size);
  margin: 0 0.2rem;
  pointer-events: none;
`;
export default GarageDetail;
