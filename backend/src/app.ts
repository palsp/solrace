import express from 'express'

import metadata from 'metadata/routes'

export const app = express()
const routes = express.Router()

routes.use('/meta-data', metadata)

app.use(routes)
