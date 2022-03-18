import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AppLayout from "~/app/AppLayout";
import TokenDetailLayout from "~/tokenDetail/TokenDetailLayout";
import {
  AppImage,
  Button,
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
import { PublicKey } from "@solana/web3.js";
import { POOL_NAME } from "~/api/solana/constants";
import { useStakeAccount } from "~/hooks/useAccount";
import { useGarageStaker } from "~/garage-staker/hooks";
import { useMintInfo } from "~/hooks/useMintInfo";
import { calculateReward } from "~/pool/utils";
import { useCountdown } from "~/hooks/useCountdown";
import { toast } from "react-toastify";
import { GARAGE_CREATOR, SOLR_MINT_ADDRESS } from "~/api/solana/addresses";
import { bond, unBond } from "~/garage/services";
import { toastAPIError } from "~/utils";
import { useWorkspace } from "~/workspace/hooks";
import ReactLoading from "react-loading";

const GarageDetail = () => {
  const { query, isReady } = useRouter();
  const { provider, wallet } = useWorkspace();
  const { garageTokenId: tokenId } = query;
  const {
    poolInfo,
    apr,
    publicAddress: poolAccount,
    revalidate: revalidatePool,
  } = usePool();

  const { data: garage } = useSWR(`/garage/${query.garageTokenId}`);
  const { mint, tokenAccountAddress } = query;
  const mintInfo = useMintInfo(poolInfo?.solrMint);
  const [reward, setReward] = useState<string>();

  const garageMint = useMemo(() => {
    if (!mint && typeof mint !== "string") {
      return undefined;
    }

    return new PublicKey(mint as string);
  }, [mint]);

  const garageTokenAccount = useMemo(() => {
    if (!tokenAccountAddress || typeof tokenAccountAddress !== "string") {
      return undefined;
    }
    return new PublicKey(tokenAccountAddress as string);
  }, [tokenAccountAddress]);

  const {
    stakeInfo,
    isStaked,
    isInitialize,
    isLoading: loadingStaker,
    publicAddress: stakingAccount,
    bump: stakingAccountBump,
    revalidate: revalidateStakeAccount,
  } = useStakeAccount(POOL_NAME, garageMint || GARAGE_CREATOR);
  const { revalidate: revalidateStaker } = useGarageStaker();
  const [loading, setLoading] = useState(false);

  const calcReward = useCallback(() => {
    if (poolInfo && stakeInfo && mintInfo) {
      setReward(
        calculateReward(stakeInfo, poolInfo, mintInfo.decimals).toFixed(2)
      );
    }
  }, [poolInfo, stakeInfo, mintInfo]);

  const { countdown, resetCountdown } = useCountdown(calcReward);

  const disabled = useMemo(() => {
    return (
      !provider ||
      !wallet ||
      !poolAccount ||
      loadingStaker ||
      !garageMint ||
      !garageTokenAccount
    );
  }, [
    provider,
    wallet,
    poolAccount,
    loadingStaker,
    garageMint,
    garageTokenAccount,
  ]);

  const toggleStake = async () => {
    if (!provider || !wallet) {
      toast("Please connect wallet", { type: "warning" });
      return;
    }

    if (!poolAccount || loadingStaker || !garageMint || !garageTokenAccount) {
      return;
    }

    setLoading(true);
    if (!isStaked) {
      try {
        const tx = await bond({
          provider,
          user: wallet.publicKey,
          poolAccount,
          solrMint: SOLR_MINT_ADDRESS,
          nftMint: garageMint,
          nftTokenAccount: garageTokenAccount,
          stakingAccount: stakingAccount!,
          stakingAccountBump: stakingAccountBump!,
          isInitialized: isInitialize!,
        });

        const resp = await provider.connection.confirmTransaction(tx);
        if (resp.value.err) {
          toastAPIError(resp.value.err, "Stake Failed");
        } else {
          toast("Congratulation! You have staked your garage.", {
            type: "success",
          });
          await Promise.all([revalidatePool(), revalidateStakeAccount()]);
        }
      } catch (e) {
        toastAPIError(e as any, "Stake Failed");
      }
    } else {
      try {
        const tx = await unBond({
          provider,
          user: wallet.publicKey,
          poolAccount,
          tokenAccount: garageTokenAccount,
          solrMint: SOLR_MINT_ADDRESS,
          stakingAccount: stakingAccount!,
        });

        const resp = await provider.connection.confirmTransaction(tx);
        if (resp.value.err) {
          toastAPIError(resp.value.err, "UnStake Failed");
        } else {
          toast("You have unstaked your garage.", {
            type: "success",
          });
          await Promise.all([
            revalidatePool(),
            revalidateStakeAccount(),
            revalidateStaker(),
          ]);
        }
      } catch (e) {
        console.log(e);
        toastAPIError(e as any, "UnStake Failed");
      }
    }
    setLoading(false);
    resetCountdown();
  };

  useEffect(() => {
    calcReward();
  }, [calcReward]);

  const buttonContent = useMemo(() => {
    if (isStaked === undefined) return "...";

    if (loading) {
      return (
        <ReactLoading
          type="bubbles"
          color="#512da8"
          height="50px"
          width="50px"
        />
      );
    }

    if (isStaked) {
      return "UNSTAKE";
    } else {
      return "STAKE";
    }
  }, [isStaked, loading]);

  return (
    <TokenDetailLayout
      direction="row-reverse"
      token3D={
        garage?.image ? (
          <WrapperGarageImage>
            <AppImage src={garage.image} width="500px" height="500px" />
          </WrapperGarageImage>
        ) : (
          <Skeleton wrapper={CardSkeleton} count={1} />
        )
      }
    >
      <TitleDiv>
        <Title fontStyle="italic">{garage?.name}</Title>
        <h3>APR - {apr}% </h3>
        {reward !== undefined && <h4>Pending Reward: {reward} SOLR</h4>}
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
        <Button
          color="primary"
          width="350px"
          disabled={disabled}
          onClick={toggleStake}
        >
          {buttonContent}
        </Button>
      </AbilityDiv>
    </TokenDetailLayout>
  );
};
const WrapperGarageImage = styled.div`
  border-radius: 0.5rem;
  width: 500px;
  overflow: hidden;
`;
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
