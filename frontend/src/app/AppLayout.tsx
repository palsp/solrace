import styled from "styled-components";
import AppNav from "~/app/AppNav";

const AppLayoutContainer = styled.div`
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 3rem 0;
  height: 100%;
  background-image: linear-gradient(
    0deg,
    hsl(139deg 91% 82%) 0%,
    hsl(145deg 85% 81%) 11%,
    hsl(152deg 80% 80%) 22%,
    hsl(158deg 76% 78%) 32%,
    hsl(164deg 73% 77%) 43%,
    hsl(170deg 69% 75%) 53%,
    hsl(175deg 67% 74%) 62%,
    hsl(181deg 66% 72%) 72%,
    hsl(185deg 73% 72%) 80%,
    hsl(189deg 80% 72%) 100%
  );
`;

const AppLayout: React.FC = ({ children }) => {
  return (
    <AppLayoutContainer>
      <AppNav />
      {children}
    </AppLayoutContainer>
  );
};

export default AppLayout;
