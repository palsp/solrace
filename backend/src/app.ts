import express, { ErrorRequestHandler } from 'express'
import cors from 'cors'

import metadata from 'metadata/routes'
import auth from 'auth/routes'
import user from 'user/routes'
import wallet from 'wallet/routes'
import nft from 'nft/routes'
import kart from 'kart/routes'
import health from 'health/routes'
import { getErrorAndStatusCode } from 'error'

export const app = express()

const origin = process.env.CORS_URL?.split(',')

const routes = express.Router()

app.use(
  cors({
    origin: origin || '*',
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

routes.use('/health', health)
routes.use('/meta-data', metadata)
routes.use('/auth', auth)
routes.use('/user', user)
routes.use('/wallet', wallet)
routes.use('/nft', nft)
routes.use('/kart', kart)

app.use(routes)

app.use(<ErrorRequestHandler>((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  const errPayload = getErrorAndStatusCode(err)

  res.status(errPayload.statusCode).send(errPayload.payload)
}))
