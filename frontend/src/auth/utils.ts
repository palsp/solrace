import jwtDecode from 'jwt-decode'

export const tokenName = 'sol_hack_nft_token'

export function getUserTokenFromStorage() {
  return localStorage.getItem(tokenName)
}

export function setUserToken(token: string) {
  return localStorage.setItem(tokenName, token)
}

export function hasTokenExpired(token: string) {
  const { exp } = jwtDecode(token) as User & { exp: number }
  return exp * 1000 <= new Date().getTime()
}

export function getDecodedUserToken(): User | null {
  const token = getUserTokenFromStorage()
  if (!token) return null
  return jwtDecode(token)
}

export function removeToken() {
  localStorage.removeItem(tokenName)
}
