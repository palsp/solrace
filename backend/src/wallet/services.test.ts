import * as anchor from '@project-serum/anchor'
import { connectDB } from 'database'
import { User } from 'entity/User'
import { fakeUser } from 'test/fixtures'
import { resetDB } from 'test/utils'
import { Connection } from 'typeorm'
import { getMessage, getOrCreateUserNonce } from 'wallet/services'

describe('Wallet services', () => {
  let user: User
  let connection: Connection

  beforeAll(async () => {
    connection = await connectDB()
  })

  afterAll(async () => {
    await connection.close()
  })

  beforeEach(async () => {
    await resetDB()
    user = await fakeUser()
  })

  describe('verifySignature', () => {
    it('verify signed message', async () => {
      const userNonce = await getOrCreateUserNonce(user)
      const { nonce } = userNonce
      const message = getMessage(nonce)

      const wallet = anchor.web3.Keypair.generate()

      expect(userNonce).toBeTruthy()
    })
  })
})
