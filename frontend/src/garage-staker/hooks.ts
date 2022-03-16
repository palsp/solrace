import { useContext } from 'react'
import { GarageStakerContext } from '~/garage-staker/GarageStakerContext'

export const useGarageStaker = () => useContext(GarageStakerContext)
