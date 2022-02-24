import { api } from '~/api'
import { removeToken } from '~/auth/utils'
import Router from 'next/router'

export async function signup(
  email: string,
  password: string,
): Promise<User & { token: string }> {
  const { data } = await api.post('/auth/signup', { email, password })
  return data
}

export async function login(
  email: string,
  password: string,
): Promise<User & { token: string }> {
  const { data: user } = await api.post('/auth/login', {
    email,
    password,
  })
  return user
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } catch (e) {
    console.error(e)
  } finally {
    removeToken()
    await Router.push('/')
  }
}
