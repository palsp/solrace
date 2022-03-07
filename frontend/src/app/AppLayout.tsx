import styled from 'styled-components'
import AppNav from '~/app/AppNav'

const AppLayoutContainer = styled.div`
  margin-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AppLayout: React.FC = ({ children }) => {
  return (
    <AppLayoutContainer>
      <AppNav />
      {children}
    </AppLayoutContainer>
  )
}

export default AppLayout
