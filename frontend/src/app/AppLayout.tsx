import styled from "styled-components";
import AppNav from "~/app/AppNav";

const AppLayoutContainer = styled.div`
  padding-top: 3rem;
  padding: 5rem 3rem 0;
  height: 100%;
  background-image: var(--background-gradient);
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
