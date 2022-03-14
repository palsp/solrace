import styled from 'styled-components'
import { useAuth } from '~/auth/hooks'
import Link from 'next/link'
import { AppLink, Row } from '~/ui'
import ConnectWalletButton from '~/wallet/ConnectWalletButton'
import Image from '~/ui/Image'

const UserSection = styled(Row)`
  width: 40%;
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
      <Link href="/" passHref>
        <Image
          src="/logo.png"
          width="200px"
          height="50px"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      <UserSection>
        <AppLink href="/garage">GARAGE</AppLink>
        <AppLink href="/kart">KART</AppLink>

        {!user ? (
          <div>
            <>
              <AppLink href="/login">LOGIN</AppLink>
              {' | '}
              <AppLink href="/register">REGISTER</AppLink>
            </>
          </div>
        ) : (
          <div>
            <AppLink href="/account">ACCOUNT</AppLink>
          </div>
        )}

        <ConnectWalletButton />
      </UserSection>
    </NavContainer>
  )
}

export default AppNav
