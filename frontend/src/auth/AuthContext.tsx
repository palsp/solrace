import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'

import jwtDecode from 'jwt-decode'
import { noop } from 'lodash'
import { logout } from '~/auth/services'
import {
  getUserTokenFromStorage,
  hasTokenExpired,
  setUserToken,
} from '~/auth/utils'
import { getUser } from '~/user/services'

interface IAuthContext {
  user?: User
  initialized: boolean
  setUser: (user: User & { token: string }) => void
  logout: () => Promise<void>
}

const defaultAuthContext: IAuthContext = {
  user: undefined,
  initialized: false,
  setUser: noop,
  logout: Promise.resolve,
}

export const AuthContext = React.createContext(defaultAuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [userState, setUserState] = useState<User | undefined>(undefined)
  const [initialized, setInitialized] = useState(false)

  const router = useRouter()

  const setUser = (user: (User & { token: string }) | null) => {
    if (user) {
      const { token, ...userData } = user
      setUserToken(token)
      setUserState(userData)
    } else {
      setUserState(undefined)
    }
  }

  const authLogout = async () => {
    await logout()
    setUser(null)
  }

  // useEffect(() => {
  // const skipLogoutAPIs = [
  //   '/auth/logout',
  //   '/auth/login',
  //   '/auth/forget-password',
  //   '/wallet',
  // ]
  // api.interceptors.response.use(
  //   (config) => config,
  //   async (error: AxiosError) => {
  //     if (error.response) {
  //       if (
  //         error.response?.status === 401 &&
  //         !skipLogoutAPIs.includes(error.config.url!)
  //       ) {
  //         await logout()
  //         setUser(null)
  //       }
  //     }
  //     throw error
  //   },
  // )
  // }, [])

  useEffect(() => {
    console.log('userEffect')
    const token = getUserTokenFromStorage()

    if (token) {
      const decodedUser = jwtDecode(token) as User
      getUser()
        .then((user) => {
          setUser({ ...decodedUser, ...user, token })
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            logout()
            setUser(null)
          }
        })
        .finally(() => setInitialized(true))
    } else {
      setUser(null)
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    const handleRouteChange = async () => {
      const token = getUserTokenFromStorage()
      if (token && hasTokenExpired(token)) {
        await logout()
        setUser(null)
        router.push('/')
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ initialized, user: userState, setUser, logout: authLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
