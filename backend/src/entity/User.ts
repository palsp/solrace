import bcrypt from 'bcryptjs'
import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  Column,
} from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'text', unique: true, nullable: true })
  email!: string

  @Column({ type: 'text', nullable: true, select: false })
  password?: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  async validatePassword(password: string) {
    if (!this.password) {
      return false
    }

    const result = await bcrypt.compare(password, this.password)
    return result
  }

  static findOneWithCredentialByEmail = async ({
    email,
  }): Promise<User | null> => {
    const user = await User.createQueryBuilder()
      .where('User.email = :email', { email })
      .addSelect('User.password')
      .getOne()

    if (!user) {
      return null
    }
    return user
  }
}
