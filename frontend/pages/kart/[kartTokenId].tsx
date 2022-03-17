import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { toastAPIError } from "~/utils";
import { POOL_NAME } from "~/api/solana/constants";
import { upgradeKart } from "~/kart/services";
import ReactLoading from "react-loading";
import { Wind, Star, ChevronsUp, Feather, CloudDrizzle } from "react-feather";

import { useRouter } from "next/router";
import { useWorkspace } from "~/workspace/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAllNFT } from "~/nft/hooks";
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
import { NFTAccount } from "~/nft/hooks";
import { useKartAccount } from "~/hooks/useAccount";

const KartDetail = () => {
  const { query, isReady } = useRouter();
  // let kartMint: any, kartTokenAccount: any;
  // if (router?.query?.nft) {
  let nft: any, kartMint: any, kartTokenAccount: any;

  useEffect(() => {
    kartMint = query.mint;
    kartTokenAccount = query.tokenAccountAddress;
    console.log("kartMint", kartMint);
    console.log("kartTokenAccount", kartTokenAccount);
  }, [isReady]);
  // let nft: any = JSON.parse(router.query.nft);
  // console.log("nft", nft);
  // ({ mint: kartMint, tokenAccountAddress: kartTokenAccount } = nft);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<PublicKey>();
  // const { mint: kartMint, tokenAccountAddress: kartTokenAccount } = nft;
  const { kartTokenId: tokenId } = query;
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();
  const { stakers } = useGarageStaker();
  const { publicAddress: poolAccount } = usePool();
  const {
    kartInfo,
    revalidate: revalidateKart,
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
    if (loadingKart || !poolAccount) {
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
        kartTokenAccount,
        stakingAccount: selectedGarage,
        isInitialize: isInitialize!,
      });
      const resp = await provider.connection.confirmTransaction(tx);
      if (resp.value.err) {
        toastAPIError(resp.value.err, "Fail! please try again");
      } else {
        toast("Congratulation! upgrade succeed", { type: "success" });
        await revalidateKart();
      }
    } catch (e) {
      toastAPIError(e, "Fail! please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TokenDetailLayout
      direction="row"
      token3D={
        <Model3D model="Cassini" marginBlock="1rem" borderRadius="0.5rem" />
      }
    >
      <TitleDiv>
        <Title fontStyle="italic">ZGMF-X42F Cassini</Title>
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
              Rarity: AR
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <ChevronsUp />
              </IconWrapper>
              Max Speed: 5
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Wind />
              </IconWrapper>
              Acceleration: 8
            </ParagraphItalicBold>
          </StatsDiv1>
          <StatsDiv2>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <CloudDrizzle />
              </IconWrapper>
              Drift: 7
            </ParagraphItalicBold>
            <ParagraphItalicBold>
              <IconWrapper size="18px">
                <Feather />
              </IconWrapper>
              Handling: 6
            </ParagraphItalicBold>
          </StatsDiv2>
        </StatsDiv>
        <Select
          onChange={handleGarageChange}
          value={selectedGarage?.toString()}
        >
          {stakers.map((staker) => (
            <option
              key={staker.publicAddress.toBase58()}
              value={staker.publicAddress.toBase58()}
            >
              {shortenIfAddress(staker.publicAddress.toBase58())} (100%)
            </option>
          ))}
        </Select>
        {/* {loading || loadingKart ? (
          <ReactLoading type="bubbles" color="var(--color-secondary)" />
        ) : ( */}
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
