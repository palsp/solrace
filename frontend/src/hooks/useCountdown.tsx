import { useEffect, useState } from 'react'

const AUTO_REFRESH_TIME = 10 * 1000

export const useCountdown = (
  fn: () => void,
  refreshTime = AUTO_REFRESH_TIME,
) => {
  const [countdown, setCountdown] = useState(refreshTime)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevState) => {
        const newCountdown = prevState - 1000
        if (newCountdown === 0) {
          fn()
          return refreshTime
        } else {
          return newCountdown
        }
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [fn])

  const resetCountdown = () => setCountdown(refreshTime)

  return { countdown, resetCountdown }
}
