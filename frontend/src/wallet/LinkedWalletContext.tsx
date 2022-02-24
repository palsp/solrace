import React from 'react'
import useSWR from 'swr'
import { useAuth } from '~/auth/hooks'

interface ILinkedWalletContext {
  publicAddress: string | null | undefined
  revalidate: () => Promise<void>
}
const defaultLinkedWalletContext: ILinkedWalletContext = {
  publicAddress: undefined,
  revalidate: Promise.resolve,
}
export const LinkedWalletContext = React.createContext(
  defaultLinkedWalletContext,
)

export const LinkedWalletProvider: React.FC = ({ children }) => {
  const { user } = useAuth()

  const { data: wallet, mutate } = useSWR(user ? '/wallet' : null)

  return (
    <LinkedWalletContext.Provider
      value={{
        publicAddress: wallet?.publicAddress || null,
        revalidate: mutate,
      }}
    >
      {children}
    </LinkedWalletContext.Provider>
  )
}
