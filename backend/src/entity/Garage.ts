import { BaseEntity, Column } from 'typeorm'

export class Garage extends BaseEntity {
  @Column({ nullable: true })
  staker?: string

  @Column()
  mintTokenAccount?: string

  @Column()
  garage_token_account?: string

  @Column()
  successRate?: number
}
