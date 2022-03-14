import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";
import { Model3D, ParagraphItalic, Select, Title } from "~/ui";
import { usePool } from "~/pool/hooks";

const GarageDetail = () => {
  const { query, isReady } = useRouter();
  const { garageTokenId: tokenId } = query;
  const { poolInfo, apr } = usePool();

  return (
    <TokenDetailLayout direction="row-reverse" token3D={<Model3D />}>
      <Title fontStyle="italic">ZX-00 Pegasus</Title>

      <ParagraphItalic>ID: {tokenId}</ParagraphItalic>
      <ParagraphItalic>Rarity: SSR</ParagraphItalic>
      <ParagraphItalic>Chances of Success: 88</ParagraphItalic>
      <Title>APR - {apr}% </Title>
    </TokenDetailLayout>
  );
};

export default GarageDetail;
