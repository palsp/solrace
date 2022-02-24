import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'
import { User } from './User'

@Entity()
export class UserNonce extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => User)
  @JoinColumn()
  user!: User

  @Column({ type: 'uuid' })
  nonce!: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @BeforeInsert()
  beforeInsert() {
    this.nonce = uuid()
  }

  static async refresh(nonce: UserNonce) {
    Object.assign(nonce, { nonce: uuid() })
    await nonce.save()
  }
}
