import { NFTMetaData } from 'entity/NFTMetadata'
import {
  BaseEntity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm'

@Entity()
export class NFTCollection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text', unique: true })
  name!: string

  @Column({ type: 'text' })
  family!: string

  @OneToMany(() => NFTMetaData, (nft) => nft.id)
  nfts!: NFTMetaData[]
}
