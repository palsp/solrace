import { NFTMetaData } from 'entity/NFTMetadata'
import {
  BaseEntity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
  Generated,
  Index,
} from 'typeorm'

@Entity()
export class NFTCollection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  symbol!: string

  @Column({ type: 'text', unique: true })
  name!: string

  @Column({ type: 'text', nullable: true })
  family?: string

  @Column({ name: 'expected_creator_address', type: 'text', nullable: true })
  expectedCreatorAddress?: string

  @Column({ name: 'candy_machine_id', type: 'text', nullable: true })
  candyMachineId?: string

  @Column({ name: 'base_image_uri', type: 'text' })
  baseImageUri!: string

  @OneToMany(() => NFTMetaData, (nft) => nft.id)
  nfts!: NFTMetaData[]
}
