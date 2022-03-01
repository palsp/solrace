import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { NFTMetaData } from './NFTMetadata'

@Entity()
export class NFTAttributes extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @OneToOne(() => NFTMetaData, (token) => [token.id, token.collection])
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
}
