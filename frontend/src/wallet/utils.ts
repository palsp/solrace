export const shortenIfAddress = (publicAddress?: string) => {
  if (!publicAddress) return '...'

  return (
    publicAddress.slice(0, 5) +
    '..' +
    publicAddress.slice(publicAddress.length - 4)
  )
}
