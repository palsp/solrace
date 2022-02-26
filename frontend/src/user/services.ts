import { api } from '~/api'

export async function getUser() {
  const { data } = await api.get(`/user/info`)
  return data as User
}
