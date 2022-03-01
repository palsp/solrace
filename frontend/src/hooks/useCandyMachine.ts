import * as anchor from '@project-serum/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useAnchorWallet } from '~/wallet/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CandyMachineAccount,
  getCandyMachineState,
} from '~/api/solana/candy-machine'
import { getAtaForMint, toDate } from '~/api/solana/candy-machine/utils'

interface Props {
  candyMachineId?: anchor.web3.PublicKey
}

export const useCandyMachine = ({ candyMachineId }: Props) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>()
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>()
  const [isWhitelistUser, setIsWhitelistUser] = useState(false)
  const [endDate, setEndDate] = useState<Date>()
  const [itemsRemaining, setItemsRemaining] = useState<number>()
  const [isPresale, setIsPresale] = useState(false)

  const [isActive, setIsActive] = useState(false)

  const { connection } = useConnection()

  const anchorWallet = useAnchorWallet()

  const revalidate = useCallback(async () => {
    if (!anchorWallet) {
      return
    }

    if (candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          candyMachineId,
          connection,
        )
        let active =
          cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000
        let presale = false
        // whitelist mint?
        if (cndy?.state.whitelistMintSettings) {
          // is it a presale mint?
          if (
            cndy.state.whitelistMintSettings.presale &&
            (!cndy.state.goLiveDate ||
              cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
          ) {
            presale = true
          }
          // is there a discount?
          if (cndy.state.whitelistMintSettings.discountPrice) {
            setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice)
          } else {
            setDiscountPrice(undefined)
            // when presale=false and discountPrice=null, mint is restricted
            // to whitelist users only
            if (!cndy.state.whitelistMintSettings.presale) {
              cndy.state.isWhitelistOnly = true
            }
          }
          // retrieves the whitelist token
          const mint = new anchor.web3.PublicKey(
            cndy.state.whitelistMintSettings.mint,
          )
          const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0]

          try {
            const balance = await connection.getTokenAccountBalance(token)
            let valid = parseInt(balance.value.amount) > 0
            // only whitelist the user if the balance > 0
            setIsWhitelistUser(valid)
            active = (presale && valid) || active
          } catch (e) {
            setIsWhitelistUser(false)
            // no whitelist user, no mint
            if (cndy.state.isWhitelistOnly) {
              active = false
            }
            console.log('There was a problem fetching whitelist token balance')
            console.log(e)
          }
        }
        // datetime to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.date) {
          setEndDate(toDate(cndy.state.endSettings.number))
          if (
            cndy.state.endSettings.number.toNumber() <
            new Date().getTime() / 1000
          ) {
            active = false
          }
        }

        // amount to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.amount) {
          let limit = Math.min(
            cndy.state.endSettings.number.toNumber(),
            cndy.state.itemsAvailable,
          )
          if (cndy.state.itemsRedeemed < limit) {
            setItemsRemaining(limit - cndy.state.itemsRedeemed)
          } else {
            setItemsRemaining(0)
            cndy.state.isSoldOut = true
          }
        } else {
          setItemsRemaining(cndy.state.itemsRemaining)
        }

        if (cndy.state.isSoldOut) {
          active = false
        }

        setIsActive((cndy.state.isActive = active))
        setIsPresale((cndy.state.isPresale = presale))
        setCandyMachine(cndy)
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state')
        console.log(e)
      }
    }
  }, [anchorWallet, candyMachineId, connection])

  useEffect(() => {
    revalidate()
  }, [anchorWallet, candyMachineId, connection, revalidate])

  return {
    candyMachine,
    discountPrice,
    isWhitelistUser,
    endDate,
    itemsRemaining,
    isPresale,
    isActive,
    revalidate,
  }
}
