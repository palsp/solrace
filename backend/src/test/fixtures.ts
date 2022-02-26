import { User } from 'entity/User'
import { DeepPartial } from 'typeorm'

export async function fakeUser(user?: DeepPartial<User>) {
  return User.create({ ...user }).save()
}
