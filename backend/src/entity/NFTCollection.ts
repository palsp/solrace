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

  @Column({ type: 'text', nullable: true })
  publicAddress?: string

  @OneToMany(() => NFTMetaData, (nft) => nft.id)
  nfts!: NFTMetaData[]
}
