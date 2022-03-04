import styled from 'styled-components'
import { Column, Row } from '~/ui'
import StakingCard from './StakingCard'

const Collection = styled(Column)`
  width: 100%;
`

const StakeArea = styled(Row)`
  width: 100%;
  justify-content: space-around;
`

interface Props {
  collection: Collection
  accounts: any[]
}
const CollectionCard: React.FC<Props> = ({ collection, accounts }) => (
  <Collection>
    <h1>{collection.name}</h1>
    <StakeArea>
      {accounts.map((account) => (
        <StakingCard
          key={account.tokenAccountAddress}
          account={account}
          candyMachineID={collection.publicAddress}
        />
      ))}
    </StakeArea>
  </Collection>
)
export default CollectionCard
