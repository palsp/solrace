import { NFTMetaData } from 'entity/NFTMetadata'
import { extend } from 'lodash'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Kart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => NFTMetaData, (token) => [token.id, token.collection], {
    eager: true,
  })
  @JoinColumn()
  token!: NFTMetaData

  @Column({ name: 'max_speed' })
  maxSpeed!: number

  @Column()
  acceleration!: number

  @Column({ name: 'drift_power_generation_rate' })
  driftPowerGenerationRate!: number

  @Column({ name: 'drift_power_consumption_rate' })
  driftPowerConsumptionRate!: number

  @Column()
  handling!: number

  @Column({ nullable: true })
  owner?: string

  @Column({ nullable: true })
  mintTokenAccount?: string

  @Column({ nullable: true })
  tokenAccount?: string
}
