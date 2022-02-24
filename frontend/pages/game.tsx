import { requestNonce, signWallet, verifySignature } from '~/wallet/services'
import { useWorkspace } from '~/workspace/hooks'

const GamePage = () => {
  const workspace = useWorkspace()
  const verify = async () => {
    const { nonce } = await requestNonce()
    const { signature, publicAddress } = await signWallet(workspace, nonce)
    await verifySignature(publicAddress!, signature!)
  }
  return (
    <div>
      <button onClick={verify}>verify</button>
    </div>
  )
}

export default GamePage
