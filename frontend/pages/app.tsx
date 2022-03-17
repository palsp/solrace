import Link from "next/link";
import styled from "styled-components";

import AppLayout from "~/app/AppLayout";
import AppNav from "~/app/AppNav";
import Card from "~/ui/card/Card";

const MainCard = styled(Card)`
  cursor: pointer;
  width: 50vh;
  box-shadow: 1px 3px #ccc;
`;

const NAV = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-around;
`;

const Home = () => {
  return (
    <>
      <AppNav />
      {/* <NAV>
          <Link href="/garage" passHref>
            <MainCard>
              <Image
                src="/garage-template-2.jpeg"
                height="25em"
                style={{
                  borderRadius: '1rem',
                }}
              />
              <Title>GARAGE</Title>
            </MainCard>
          </Link>
          <Link href="/kart" passHref>
            <MainCard>
              <Image
                src="/kart-template.png"
                height="25em"
                style={{
                  borderRadius: '1rem',
                }}
              />
              <Title>KART</Title>
            </MainCard>
          </Link>
        </NAV> */}
      <WrapperIndex>
        <VideoWrapper>
          <Video src="/solrace-map.mp4" controls></Video>
        </VideoWrapper>
        {/* <Button width="300px" color="primary">
            Mint
          </Button> */}
      </WrapperIndex>
    </>
  );
};

const WrapperIndex = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const VideoWrapper = styled.div`
  /* margin-left: -3rem; */
  position: absolute;
  top: 0;
  left: -25px;
  max-height: 100%;
  width: 100vw;
  /* height: 90%; */
`;
const Video = styled.video`
  min-width: 111.5vw;
  /* min-height: 100%; */
`;

export default Home;
