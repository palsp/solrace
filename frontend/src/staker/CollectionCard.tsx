import styled from 'styled-components'
import { POOL_NAME } from '~/api/solana/constants'
import { usePoolAccount } from '~/hooks/useAccount'
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
const CollectionCard: React.FC<Props> = ({ collection, accounts }) => {
  const { poolInfo, revalidate } = usePoolAccount(POOL_NAME)

  return (
    <Collection>
      <h1>{collection.name}</h1>
      <StakeArea>
        {accounts.map((account) => (
          <StakingCard
            key={account.tokenAccountAddress}
            poolAccountInfo={poolInfo}
            revalidatePool={revalidate}
            account={account}
            candyMachineID={collection.publicAddress}
          />
        ))}
      </StakeArea>
    </Collection>
  )
}

export default CollectionCard
