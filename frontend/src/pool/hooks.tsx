import { useContext } from 'react'
import { PoolContext } from '~/pool/PoolContext'

export const usePool = () => useContext(PoolContext)
