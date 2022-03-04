import { useContext } from 'react'
import { NFTContext } from '~/nft/NFTContext'

export const useNFT = () => useContext(NFTContext)
