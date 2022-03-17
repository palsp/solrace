import { BN } from "@project-serum/anchor";

export const toEther = (amountWei: string | BN, decimals: number) => {
  return new BN(amountWei).div(new BN(10 ** decimals));
};

export const toEtherString = (amountWei: string | BN, decimals = 9) => {
  return new BN(amountWei)
    .div(new BN(10 ** decimals))
    .toNumber()
    .toFixed(2);
};
