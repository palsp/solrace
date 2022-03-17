import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import AppLayout from "~/app/AppLayout";
import Title from "~/ui/title/Title";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { AppImage, Button, Paragraph } from "~/ui";
import { useWorkspace } from "~/workspace/hooks";
import { useAnchorWallet } from "~/wallet/hooks";
import { BN } from "@project-serum/anchor";
import { useCallback, useMemo, useState } from "react";
import { getUserBalance, handleMintError, mint } from "~/mint/services";
import { useCandyMachine } from "~/hooks/useCandyMachine";
import { KART_CM_ID, GARAGE_CM_ID } from "~/api/solana/addresses";
import { toast } from "react-toastify";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { toastAPIError } from "~/utils";
import ReactLoading from "react-loading";
import { useNFT } from "~/nft/hooks";
import { usePool } from "~/pool/hooks";
import { GARAGE_COLLECTION_NAME } from "~/garage/constants";
import { KART_COLLECTION_NAME } from "~/kart/constants";
import AppNav from "~/app/AppNav";

const MintPage = () => {
  const { connected } = useWallet();

  const { provider } = useWorkspace();
  const anchorWallet = useAnchorWallet();
  const { poolInfo } = usePool();
  const [sufficientFund, setSufficientFund] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  const { getNFTOfCollection, revalidateNFTs } = useNFT();

  const garages = useMemo(() => {
    return getNFTOfCollection(GARAGE_COLLECTION_NAME);
  }, [getNFTOfCollection]);

  const karts = useMemo(() => {
    return getNFTOfCollection(KART_COLLECTION_NAME);
  }, [getNFTOfCollection]);

  const { candyMachine: kartCM, revalidateCandyMachine: revalidateKartCM } =
    useCandyMachine({
      candyMachineId: KART_CM_ID,
    });

  const { candyMachine: garageCM, revalidateCandyMachine: revalidateGarageCM } =
    useCandyMachine({
      candyMachineId: GARAGE_CM_ID,
    });

  // const validateUserBalance = useCallback(async () => {
  //   if (!anchorWallet || !candyMachine || !provider) {
  //     return
  //   }

  //   const [balance] = await getUserBalance(
  //     anchorWallet.publicKey,
  //     provider.connection,
  //     candyMachine.state.tokenMint,
  //   )

  //   setSufficientFund(new BN(balance).gte(candyMachine.state.price))
  // }, [anchorWallet, provider, candyMachine])

  // useEffect(() => {
  //   validateUserBalance()
  // }, [validateUserBalance])

  const handleMintKart = async () => {
    // if (!sufficientFund) {
    //   toast('Insufficient Balance', { type: 'error' })
    //   return
    // }

    if (!provider || !kartCM?.program) {
      toast("Please connect wallet", { type: "warning" });
      return;
    }

    setClicked(true);
    if (kartCM?.state.isActive && kartCM?.state.gatekeeper) {
      if (gatewayStatus === GatewayStatus.ACTIVE) {
        setClicked(true);
      } else {
        await requestGatewayToken();
      }
    } else {
      try {
        setIsPending(true);
        const [mintTxId] = await mint({ provider, candyMachine: kartCM });
        const resp = await provider.connection.confirmTransaction(mintTxId);
        if (resp.value.err) {
          toast("Mint Failed", { type: "error" });
        } else {
          await Promise.all([revalidateNFTs(), revalidateKartCM()]);
          toast("Congratulation! You have Minted new kart", {
            type: "success",
          });
        }
      } catch (e) {
        toast("Mint Failed", { type: "error" });
      } finally {
        setIsPending(false);
        setClicked(false);
      }
    }
  };

  const handleMintGarage = async () => {
    // if (!sufficientFund) {
    //   toast("Insufficient Balance", { type: "error" });
    //   return;
    // }

    if (garageCM?.state.isActive && garageCM?.state.gatekeeper) {
      if (gatewayStatus === GatewayStatus.ACTIVE) {
        setClicked(true);
      } else {
        await requestGatewayToken();
      }
    } else {
      try {
        setIsPending(true);
        if (!provider || !garageCM?.program) {
          toast("Please connect wallet", { type: "warning" });
          return;
        }

        const [mintTxId] = await mint({
          provider,
          candyMachine: garageCM,
        });
        const resp = await provider.connection.confirmTransaction(mintTxId);
        if (resp.value.err) {
          toastAPIError(resp.value.err, "Mint Failed");
        } else {
          await Promise.all([revalidateGarageCM(), revalidateNFTs()]);
          toast("Congratulation! You have Minted new garage.", {
            type: "success",
          });
        }
      } catch (e) {
        const message = handleMintError(e);
        toast(message, { type: "error" });
      } finally {
        setIsPending(false);
        setClicked(false);
      }
    }
  };

  const mintKartButtonContent = useMemo(() => {
    if (kartCM?.state.isSoldOut) {
      return "SOLD OUT";
    } else if (isPending) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    } else if (kartCM?.state.isPresale || kartCM?.state.isWhitelistOnly) {
      return "WHITELIST MINT";
    } else if (clicked && kartCM?.state.gatekeeper) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    }

    return "MINT";
  }, [clicked, isPending, kartCM]);

  const mintGarageButtonContent = useMemo(() => {
    if (garageCM?.state.isSoldOut) {
      return "SOLD OUT";
    } else if (isPending) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    } else if (garageCM?.state.isPresale || garageCM?.state.isWhitelistOnly) {
      return "WHITELIST MINT";
    } else if (clicked && garageCM?.state.gatekeeper) {
      return <ReactLoading type="bubbles" color="#512da8" />;
    }

    return "MINT";
  }, [clicked, isPending, garageCM]);

  const handleClick = () => {
    console.log("click...");
  };
  return (
    <>
      <AppNav />
      <WrapperMint>
        <WrapperTrack>
          <AppImage src="/mint-track.png" width="100vw"></AppImage>
        </WrapperTrack>
        <TitleDiv>
          <h3>MINT SolRace NFTs</h3>
        </TitleDiv>
        {!connected ? (
          <Paragraph>Please Connect Your Wallet</Paragraph>
        ) : (
          <WrapperContent>
            <WrapperMintKart>
              <Button color="primary" onClick={handleMintKart} width="50%">
                Mint Kart
              </Button>
              <h4>
                A 8,888 Genesis Solakarts represent a heart of the game. Each
                model comes with unique rarity and attributes
              </h4>
              <AppImage src="/kart-nft.png" width="60%" height="225px" />
            </WrapperMintKart>
            <WrapperMintGarage>
              <AppImage src="/land-nft.png" width="60%" height="310px" />

              <h4>
                An exclusive 888 plots of garage where Kart performance upgrade
                takes place. Garage owners could earn passive income via a fair
                share of upgrading fee
              </h4>
              <Button color="secondary" onClick={handleMintGarage} width="50%">
                Mint Garage
              </Button>
            </WrapperMintGarage>
          </WrapperContent>
        )}
      </WrapperMint>
    </>
  );
};

const WrapperMint = styled.div`
  position: relative;
  padding: 5rem 3rem 1rem;
  height: 100%;
  /* background-image: var(--background-gradient-1); */
  background-image: url("/game-4.png");

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow-x: hidden;
`;
const WrapperTrack = styled.div`
  position: absolute;
  left: 0;
  top: 47.5%;
`;

const WrapperContent = styled.div`
  position: relative;
  display: flex;
  gap: 3rem;
`;
const WrapperMintKart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-elevation-low-black);
  color: var(--color-white);
`;
const WrapperMintGarage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-elevation-low-black);
  color: var(--color-white);
`;

const TitleDiv = styled.div`
  background: var(--color-primary-dark);
  width: fit-content;
  padding: 1rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  border-radius: 0.25rem;
  margin: 1.5rem auto;
`;
export default MintPage;
