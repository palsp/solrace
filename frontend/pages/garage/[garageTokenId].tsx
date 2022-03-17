import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";
import {
  AppImage,
  Model3D,
  ParagraphItalic,
  ParagraphItalicBold,
  Select,
  Title,
} from "~/ui";
import { usePool } from "~/pool/hooks";
import { Star, Award, DollarSign, Shield, Activity } from "react-feather";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { CardSkeleton } from "~/ui/card";

const GarageDetail = () => {
  const { query, isReady } = useRouter();
  const { garageTokenId: tokenId } = query;
  const { poolInfo, apr } = usePool();

  const { data: garage } = useSWR(`/garage/${query.garageTokenId}`);

  console.log(garage?.image);
  return (
    <TokenDetailLayout
      direction="row-reverse"
      token3D={
        garage?.image ? (
          <AppImage src={garage.image} width="500px" height="500px"></AppImage>
        ) : (
          <Skeleton wrapper={CardSkeleton} count={1} />
        )
      }
    >
      <TitleDiv>
        <Title fontStyle="italic">{garage?.name}</Title>
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
              <IconWrapper size="18px">
                <Star />
              </IconWrapper>
              Rarity: SS
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Award />
              </IconWrapper>
              Success: 88%
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <DollarSign />
              </IconWrapper>
              Price: 86
            </ParagraphItalicBold>
          </StatsDiv1>
          <StatsDiv2>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Shield />
              </IconWrapper>
              Fame: 7
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
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

interface Props {
  size: string;
}
const IconWrapper = styled.div`
  display: inline-block;
  width: ${(props: Props) => props.size};
  height: ${(props: Props) => props.size};
  margin: 0 0.2rem;
  pointer-events: none;
`;

export default GarageDetail;
