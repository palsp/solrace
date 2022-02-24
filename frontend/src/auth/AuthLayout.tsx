import Link from 'next/link'
import styled from 'styled-components'

const AuthLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 20vw;
  width: 100vw;
  height: 100vh;
  margin-top: 5rem;
  margin-top: 20vh;
`

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2em;
`

const AuthLayout: React.FC = ({ children }) => {
  return (
    <AuthLayoutContainer>
      <NavContainer>
        <Link href="/">back</Link>
      </NavContainer>
      {children}
    </AuthLayoutContainer>
  )
}
export default AuthLayout
