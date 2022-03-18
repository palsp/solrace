import { NFTMetaData } from 'entity/NFTMetadata'
import _, { extend } from 'lodash'
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

  @Column({ name: 'drift_power_generation_rate', type: 'float' })
  driftPowerGenerationRate!: number

  @Column({ name: 'drift_power_consumption_rate', type: 'float' })
  driftPowerConsumptionRate!: number

  @Column()
  handling!: number

  @Column()
  model!: string

  @Column({ nullable: true })
  owner?: string

  @Column({ nullable: true })
  mintTokenAccount?: string

  @Column({ nullable: true })
  tokenAccount?: string

  json(): MetadataResponse {
    const { token, ...attributes } = this
    const { files, creators, collection, ...metadata } = token

    const initial: MetadataAttribute[] = []
    const parsedAttributes: MetadataAttribute[] = Object.entries(
      _.omit(attributes, ['id', 'owner', 'mintTokenAccount', 'tokenAccount']),
    ).reduce((prev, curr) => {
      prev.push({
        trait_type: curr[0],
        value: curr[1],
      })
      return prev
    }, initial)

    return {
      ...metadata,
      attributes: parsedAttributes,
      properties: {
        files,
        creators,
      },
    }
  }
}
