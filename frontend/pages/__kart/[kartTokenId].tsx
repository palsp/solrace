import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { toastAPIError } from "~/utils";
import { POOL_NAME } from "~/api/solana/constants";
import { upgradeKart } from "~/kart/services";

import { Wind, Star, ChevronsUp, Feather, CloudDrizzle } from "react-feather";

import { useRouter } from "next/router";
import { useWorkspace } from "~/workspace/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import { usePool } from "~/pool/hooks";
import {
  Model3D,
  ParagraphItalic,
  ParagraphItalicBold,
  Select,
  Title,
} from "~/ui";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";
import { shortenIfAddress } from "~/wallet/utils";
import Button from "~/ui/button/Button";
import { useGarageStaker } from "~/garage-staker/hooks";
import { useKartAccount } from "~/hooks/useAccount";
import useSWR from "swr";
import { useMetadata, useNFT } from "~/nft/hooks";
import { Staker } from "~/api/solana/account/stake-account";
import { BN } from "@project-serum/anchor";

const KartDetail = () => {
  const { query } = useRouter();
  const { mint, tokenAccountAddress } = query;

  const { poolInfo, revalidate: revalidatePool } = usePool();
  const {
    initialize,
    data: kart,
    mintAccount: kartMint,
    tokenAccount: kartTokenAccount,
    revalidateMetadata: revalidateKart,
  } = useMetadata(mint as string, tokenAccountAddress as string);

  const [modelUrl, setModelUrl] = useState<string>();

  const fetchModelUrl = useCallback(async () => {
    if (!kart) return;

    const urlParts = kart.image.split("/");

    urlParts[urlParts.length - 1] = "Cassini.gltf";

    setModelUrl(urlParts.join("/"));
  }, [kart]);

  const isAbleToUpgrade = useMemo(() => {
    return initialize && kart;
  }, [initialize, kart]);

  useEffect(() => {
    fetchModelUrl();
  }, [fetchModelUrl]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<PublicKey>();
  const { kartTokenId: tokenId } = query;
  const { provider } = useWorkspace();
  const { stakers } = useGarageStaker();
  const { publicAddress: poolAccount } = usePool();
  const {
    revalidate: revalidateKartAccount,
    publicAddress,
    isInitialize,
    bump,
    isLoading: loadingKart,
  } = useKartAccount(POOL_NAME, kartMint);

  const handleGarageChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    if (e.target.value !== "") {
      setSelectedGarage(new PublicKey(e.target.value));
    } else {
      setSelectedGarage(undefined);
    }
  };

  const handleUpgrade = async () => {
    // if (!solRaceProgram || !provider) return
    if (!selectedGarage) {
      toast("Please select the garage to enhance your kart", {
        type: "warning",
      });
      return;
    }

    if (
      loadingKart ||
      !poolAccount ||
      !kartMint ||
      !kartTokenAccount ||
      !poolInfo
    ) {
      // not finish loading
      return;
    }

    setLoading(true);

    try {
      // we can ensure all ! field is exist by checking is loading
      const tx = await upgradeKart({
        provider,
        poolAccount,
        kartMint,
        kartAccount: publicAddress!,
        kartAccountBump: bump!,
        poolSolr: poolInfo.poolSolr,
        solrMint: poolInfo.solrMint,
        kartTokenAccount,
        stakingAccount: selectedGarage,
        isInitialize: isInitialize!,
      });
      const resp = await provider.connection.confirmTransaction(tx);
      if (resp.value.err) {
        toastAPIError(resp.value.err, "Fail! please try again");
      } else {
        toast("Congratulation! upgrade succeed", { type: "success" });
        await Promise.all([
          revalidateKart(),
          revalidateKartAccount(),
          revalidatePool(),
        ]);
      }
    } catch (e) {
      console.log(e);
      toastAPIError(e, "Fail! please try again");
    } finally {
      setLoading(false);
    }
  };

  const getMultiplier = (staker: Staker) => {
    if (!poolInfo) {
      return "";
    }

    if (!staker.multiplier || staker.multiplier.eq(new BN("0"))) {
      return "( deprecated )";
    }

    const maxMultiplierUnit = poolInfo.maxMultiplier.div(
      poolInfo.multiplierUnit
    );
    return `( x${staker.multiplier
      .mul(maxMultiplierUnit)
      .div(poolInfo.maxMultiplier)
      .toString()} )`;
  };

  return (
    <TokenDetailLayout
      direction="row"
      token3D={
        <Model3D
          model="Cassini"
          modelUrl={modelUrl}
          marginBlock="1rem"
          borderRadius="0.5rem"
        />
      }
    >
      <TitleDiv>
        <Title fontStyle="italic">
          {kart?.name} ( {kart?.attributes[5].value} )
        </Title>
        <ParagraphItalic>ID: {tokenId}</ParagraphItalic>
      </TitleDiv>

      <AbilityDiv>
        <StatsDiv>
          <StatsDiv1>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Star />
              </IconWrapper>
              Rarity: AR
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <ChevronsUp />
              </IconWrapper>
              Max Speed: {kart?.attributes[0].value || "..."}
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Wind />
              </IconWrapper>
              Acceleration: {kart?.attributes[1].value || "..."}
            </ParagraphItalicBold>
          </StatsDiv1>
          <StatsDiv2>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <CloudDrizzle />
              </IconWrapper>
              Drift: {kart?.attributes[2].value || "..."}
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Feather />
              </IconWrapper>
              Handling: {kart?.attributes[4].value || "..."}
            </ParagraphItalicBold>
          </StatsDiv2>
        </StatsDiv>
        {isAbleToUpgrade && (
          <>
            <Select
              onChange={handleGarageChange}
              value={selectedGarage?.toString()}
            >
              <option key="1234" value="select garage">
                Select Garage
              </option>
              {stakers.map((staker) => (
                <option
                  key={staker.publicAddress.toBase58()}
                  value={staker.publicAddress.toBase58()}
                >
                  {shortenIfAddress(staker.publicAddress.toBase58())}{" "}
                  {getMultiplier(staker)}
                </option>
              ))}
            </Select>

            <Button
              onClick={handleUpgrade}
              disabled={loading || loadingKart || !selectedGarage}
              color="secondary"
              width="350px"
              icon="upgrade"
              padding="0.5rem"
            >
              Upgrade
            </Button>
          </>
        )}
      </AbilityDiv>
      {/* )} */}
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

export default KartDetail;
