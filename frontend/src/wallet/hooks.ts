import * as anchor from '@project-serum/anchor'
import { useContext, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { LinkedWalletContext } from '~/wallet/LinkedWalletContext'

export const useLinkedWallet = () => useContext(LinkedWalletContext)

export const useAnchorWallet = () => {
  const wallet = useWallet()

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet
  }, [wallet])

  return anchorWallet
}
