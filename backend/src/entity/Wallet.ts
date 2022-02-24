import { User } from 'entity/User'
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string

  @OneToOne(() => User)
  @JoinColumn()
  user!: User

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date
}
