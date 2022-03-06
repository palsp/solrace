import styled from 'styled-components'
import { useAuth } from '~/auth/hooks'
import Link from 'next/link'
import { Row } from '~/ui'
import ConnectWalletButton from '~/wallet/ConnectWalletButton'

const UserSection = styled(Row)`
  width: 60%;
  justify-content: space-evenly;
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
const AppNav = () => {
  const { user } = useAuth()
  return (
    <NavContainer>
      <Link href="/">MARIO KART</Link>

      <UserSection>
        <Link href="/mint">MINT</Link>

        <Link href="/garage">GARAGE</Link>
        <Link href="/kart">KART</Link>
        {!user ? (
          <div>
            <>
              <Link href="/login">Login</Link>
              {' | '}
              <Link href="/register">Register</Link>
            </>
          </div>
        ) : (
          <div>
            <Link href="/account">Account</Link>
          </div>
        )}

        <ConnectWalletButton />
      </UserSection>
    </NavContainer>
  )
}

export default AppNav
