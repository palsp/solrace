import '../config/env'

import { connectDB } from 'database'
import { app } from 'app'

const port = process.env.PORT || 8080

async function main() {
  await connectDB()
  console.log('CONNECTED TO DATABASE')

  app.listen(port, () => console.log(`LISTENING ON PORT ${port}...`))
}

main()
