import express from 'express'
import { getKartOfOwner } from 'kart/services'

const router = express.Router()

router.get('/:owner', async (req, res, next) => {
  try {
    const karts = await getKartOfOwner(req.params.owner)

    res.send(karts)
  } catch (e) {
    next(e)
  }
})

export default router
