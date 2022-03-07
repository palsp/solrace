import * as anchor from '@project-serum/anchor'
import { CandyMachineAccount } from '~/api/solana/candy-machine'
import { toEther } from '~/api/solana/utils/parse-ether'
import { Row } from '~/ui'

interface Props {
  candyMachine: CandyMachineAccount
  itemsRemaining?: number
  isPresale: boolean
  discountPrice?: anchor.BN
  isWhitelistUser: boolean
  isActive: boolean
  endDate?: Date
}

const MintCard: React.FC<Props> = ({
  candyMachine,
  isWhitelistUser,
  isActive,
  isPresale,
  itemsRemaining = 0,
  discountPrice = new anchor.BN(0),
  endDate,
}) => {
  return (
    <Row>
      <div>
        <h1>Remaining</h1>
        <h1
          style={{
            fontWeight: 'bold',
          }}
        >
          {`${itemsRemaining}`}
        </h1>
      </div>
      <div>
        <div>
          {isWhitelistUser && discountPrice ? 'Discount Price' : 'Price'}
        </div>
        <div style={{ fontWeight: 'bold' }}>
          {isWhitelistUser && discountPrice
            ? `◎ ${toEther(discountPrice.toString(), 9)}`
            : `◎ ${toEther(candyMachine.state.price.toString(), 9)}`}
        </div>
      </div>
    </Row>
  )
}

export default MintCard
