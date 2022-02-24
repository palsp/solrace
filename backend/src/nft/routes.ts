import express from 'express'
import { getNFTAccountByCollection } from 'nft/services'

const router = express.Router()

router.get('/:publicAddress', async (req, res, next) => {
  try {
    const accounts = await getNFTAccountByCollection(req.params.publicAddress)
    res.send(accounts)
  } catch (e) {
    next(e)
  }
})

export default router
