import { api } from '~/api'

export const upgradeKart = async (txId: string) => {
  const { data } = await api.get(`/upgrade/${txId}`)
  console.log(data)
  return data
}
