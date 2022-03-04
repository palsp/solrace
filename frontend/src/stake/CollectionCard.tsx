import styled from 'styled-components'
import { SOL_RACE_STAKING_PROGRAM_ID } from '~/api/addresses'
import { usePoolAccount } from '~/hooks/useAccount'
import { poolName } from '~/stake/services'
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
  const { poolAccountInfo, revalidate } = usePoolAccount(
    SOL_RACE_STAKING_PROGRAM_ID,
    poolName,
  )

  return (
    <Collection>
      <h1>{collection.name}</h1>
      <StakeArea>
        {accounts.map((account) => (
          <StakingCard
            key={account.tokenAccountAddress}
            poolAccountInfo={poolAccountInfo}
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
