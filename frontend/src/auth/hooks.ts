import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AuthContext } from '~/auth/AuthContext'

export const useAuth = () => useContext(AuthContext)

export function useRequireAuth(redirect: string = '/login') {
  const { user, initialized } = useAuth()
  const { push, pathname } = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      push(`${redirect}/?from=${encodeURIComponent(pathname)}`)
    }
  }, [initialized, user])
}
