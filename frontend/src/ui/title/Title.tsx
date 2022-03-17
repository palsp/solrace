import styled from "styled-components";
interface Props {
  fontStyle?: string;
}

const Title: React.FC<Props> = ({ children, fontStyle }) => {
  return <StyledH1 fontStyle={fontStyle}>{children}</StyledH1>;
};

const StyledH1 = styled.h1`
  font-style: ${(props: Props) => props.fontStyle};
`;
export default Title;
