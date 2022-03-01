import Link from 'next/link'
import AppLayout from '~/app/AppLayout'

const Home = () => {
  return (
    <AppLayout>
      <Link href="/mint">MINT</Link>
    </AppLayout>
  )
}

export default Home
