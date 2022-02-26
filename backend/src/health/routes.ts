import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    status: 'up',
    timestamp: new Date().toISOString(),
  })
})

export default router
