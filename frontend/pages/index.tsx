import Link from 'next/link'
import styled from 'styled-components'

import AppLayout from '~/app/AppLayout'

import { useWorkspace } from '~/workspace/hooks'

const NAV = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-around;
`
const Home = () => {
  return (
    <AppLayout>
      <NAV>
        <Link href="/mint">MINT</Link>

        <Link href="/garage">GARAGE</Link>
        <Link href="/kart">KART</Link>
      </NAV>
    </AppLayout>
  )
}

export default Home
