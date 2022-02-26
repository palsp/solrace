import styled from 'styled-components'
import AppNav from '~/app/AppNav'

const AppLayoutContainer = styled.div`
  margin-top: 20vh;
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
