import styled from "styled-components";
import AppNav from "~/app/AppNav";

const AppLayoutContainer = styled.div`
  padding: 5rem 3rem 1rem;
  height: 100%;
  background-image: var(--background-gradient-1);
  overflow-x: hidden;
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
