import Link from "next/link";
import styled from "styled-components";

import AppLayout from "~/app/AppLayout";
import Card from "~/ui/Card";
import Title from "~/ui/Title";
import Image from "~/ui/Image";
import Button from "~/ui/Button";

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
    <AppLayout>
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
      <Wrapper>
        <VideoWrapper>
          <Video src="/car_driving.mp4" controls></Video>
        </VideoWrapper>
        {/* <Button width="300px" color="primary">
          Mint
        </Button> */}
      </Wrapper>
    </AppLayout>
  );
};

const Wrapper = styled.div``;

const VideoWrapper = styled.div`
  /* margin-left: -3rem; */
  position: absolute;
  top: 5rem;
  left: 0;
  max-height: 100%;
  width: 100%;
  /* height: 90%; */
`;
const Video = styled.video`
  min-width: 100%;
`;

export default Home;
