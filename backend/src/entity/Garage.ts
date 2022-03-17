import { NFTMetaData } from 'entity/NFTMetadata'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Garage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  base!: string

  @Column()
  garage!: string

  @Column()
  door!: string

  @Column()
  tree!: string

  @Column({ name: 'success_rate', type: 'float' })
  successRate!: number

  @Column({ nullable: true })
  mintTokenAccount?: string

  @Column({ nullable: true })
  staker?: string

  @Column({ nullable: true })
  garage_token_account?: string

  @OneToOne(() => NFTMetaData, (token) => [token.id, token.collection], {
    eager: true,
  })
  @JoinColumn()
  token!: NFTMetaData
}
