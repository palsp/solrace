import { NFTCollection } from 'entity/NFTCollection'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'

@Entity()
export class NFTMetaData extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column({ type: 'text' })
  name!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ name: 'seller_fee_basis_points' })
  sellerFeeBasisPoints!: number

  @Column({ type: 'text' })
  image!: string

  @Column({ name: 'external_url' })
  externalUrl?: string

  @Column()
  edition?: number

  @Column({ type: 'text' })
  symbol!: string

  @Column('simple-json')
  attributes!: { trait_type: string; value: number }[]

  @Column('simple-json')
  files!: { uri: string; type: string }[]

  @Column('simple-json')
  creators!: { address: string; share: number }[]

  @ManyToOne(() => NFTCollection, (collection) => collection.nfts, {
    eager: true,
    primary: true,
  })
  @JoinColumn()
  collection!: NFTCollection
}
