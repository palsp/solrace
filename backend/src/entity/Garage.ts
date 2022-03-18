import { NFTMetaData } from 'entity/NFTMetadata'
import _ from 'lodash'
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
