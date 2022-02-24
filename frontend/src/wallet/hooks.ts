import { useContext } from 'react'
import { LinkedWalletContext } from '~/wallet/LinkedWalletContext'

export const useLinkedWallet = () => useContext(LinkedWalletContext)
