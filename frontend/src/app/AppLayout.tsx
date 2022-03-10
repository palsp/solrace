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
    320deg,
    hsl(138deg 37% 86%) 0%,
    hsl(143deg 42% 86%) 11%,
    hsl(149deg 45% 86%) 22%,
    hsl(156deg 51% 86%) 32%,
    hsl(161deg 54% 86%) 43%,
    hsl(167deg 59% 87%) 53%,
    hsl(172deg 64% 87%) 62%,
    hsl(177deg 67% 87%) 72%,
    hsl(184deg 73% 87%) 80%,
    hsl(188deg 76% 87%) 100%
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
