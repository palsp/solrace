import '../config/env'
import 'solana'

import { connectDB } from 'database'
import { app } from 'app'

const port = process.env.PORT || 8080

// check env

async function main() {
  await connectDB()
  console.log('CONNECTED TO DATABASE')

  app.listen(port, () => console.log(`LISTENING ON PORT ${port}...`))
}

main()
