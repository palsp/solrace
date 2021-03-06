import styled from "styled-components";

interface Props {
  src: string;
  width?: string;
  height?: string;
  border?: string;
}

const AppImage = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-origin: border-box;
  background-clip: border-box;
  background-image: ${(props: Props) => `url(${props.src})`};
  width: ${(props: Props) => props.width || "100%"};
  height: ${(props: Props) => props.height || "20vh"};
  border-radius: ${(props: Props) => props.border};
`;

export default AppImage;
