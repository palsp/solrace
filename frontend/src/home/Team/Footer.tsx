import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { AppImage, AppLink } from "~/ui";
const Footer = () => {
  return (
    <WrapperFooter>
      <WrapperFlex>
        <FooterLogo>
          <Link href="/" passHref>
            <AppImage
              src="/solrace-sol.png"
              width="200px"
              height="100px"
              style={{ cursor: "pointer", marginBottom: "0.5rem" }}
            />
          </Link>
        </FooterLogo>
        <FooterNav>
          <AppLink href="/home">Home</AppLink>
          <AppLink href="/litepaper">Litepaper</AppLink>
          <AppLink href="/marketplace">Marketplace</AppLink>
          <AppLink href="/Roadmap">Roadmap</AppLink>
          <AppLink href="/Team">Team</AppLink>
        </FooterNav>
        <FooterCommunity>
          <p>Community</p>
          <SocialDiv>
            <AppImage src="/twitter-black.png" width="34px" height="34px" />
            <AppImage src="/discord-black.png" width="34px" height="34px" />
            <AppImage src="/telegram-black.png" width="34px" height="34px" />
            <AppImage src="/medium-black.png" width="34px" height="34px" />
          </SocialDiv>
          <p>Join us!</p>
          <SmallDescription>
            We are currently growing and expanding
          </SmallDescription>
        </FooterCommunity>
        <FooterGame>
          <AppImage
            src="/available-steam.png"
            width="300px"
            height="80px"
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          />
        </FooterGame>
      </WrapperFlex>
      <WrapperLegal>
        <SmallDescription>Terms of Services</SmallDescription>
        <SmallDescription>Privacy Policy</SmallDescription>
        <SmallDescription>Give us feedback</SmallDescription>
      </WrapperLegal>
    </WrapperFooter>
  );
};
const WrapperFooter = styled.div`
  background: var(--background-gradient-2);
  border-radius: 0.25rem 0.25rem 0 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  /* height: 45%; */
  /* color: white; */
  /* margin-top: 6.5rem; */
  /* height: 100px; */
  /* width: 100vw; */
  color: black;
`;
const WrapperFlex = styled.div`
  display: flex;
  gap: 4rem;
  justify-content: center;
  padding-top: 1rem;
  align-items: center;
`;
const WrapperLegal = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.75rem 0 0.25rem;
  padding: 0 2rem;
  & > * {
    cursor: pointer;
  }
`;
const FooterLogo = styled.div``;
const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const FooterCommunity = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const SocialDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  & > * {
    cursor: pointer;
  }
`;
const FooterGame = styled.div``;

const SmallDescription = styled.p`
  font-size: 0.6rem;
`;
export default Footer;
