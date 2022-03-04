import { PublicKey } from '@solana/web3.js'
import { verifyNFT } from '~/stake/services'
import Link from 'next/link'
import { useEffect } from 'react'
import AppLayout from '~/app/AppLayout'

import { useWorkspace } from '~/workspace/hooks'

const Home = () => {
  const { provider, wallet } = useWorkspace()
  const verify = async () => {
    if (!provider || !wallet) {
      return
    }

    try {
      const tx = await verifyNFT({
        provider,
        creator: new PublicKey('81VPS4Cu7tq2QdqpAAA3Zsbh1dxLpNq7fbcKQ5Rgs6xC'),
        wallet,
        nftMint: new PublicKey('GrVxzjyG4Z5nbE7SR7sq7Z8muMwdqCawfP69hjzmuZob'),
        // nftMint: new PublicKey('HzDeFzmNx3cvtQP2GnJAwwzjDGBzRTQMADLdhBLXG2y5'),
      })

      // const resp = await provider.connection.confirmTransaction(tx)
      // console.log(resp)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <AppLayout>
      <button onClick={verify}>verify</button>
    </AppLayout>
  )
}

export default Home
