import dayjs from 'dayjs'

export const formatTime = (unixTimestamp: number, format = 'lll') => {
  return dayjs.unix(unixTimestamp).format(format)
}
