import axios from 'axios'
import { getUserTokenFromStorage } from '~/auth/utils'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

api.interceptors.request.use((config) => {
  const token = getUserTokenFromStorage()
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config
})
