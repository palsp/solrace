import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";

const GarageDetail = () => {
  const router = useRouter();
  const { garageDetail: tokenId } = router.query;

  return <AppLayout> GarageDetail {tokenId}</AppLayout>;
};

export default GarageDetail;
