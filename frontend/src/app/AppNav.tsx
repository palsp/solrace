import styled from 'styled-components'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '~/auth/hooks'
import Link from 'next/link'
import { Row } from '~/ui'

const UserSection = styled(Row)`
  width: 25%;
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
  const { connected } = useWallet()
  const { user } = useAuth()
  return (
    <NavContainer>
      <div style={{ width: '10%' }}>MARIO KART</div>
      <UserSection>
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

        <WalletMultiButton />
      </UserSection>
    </NavContainer>
  )
}

export default AppNav
