import { BN } from '@project-serum/anchor'

export const toEther = (amountWei: string, decimals: number) => {
  return new BN(amountWei).div(new BN(10 ** decimals))
}
