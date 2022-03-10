import { PublicKey } from '@solana/web3.js';
import { verifyNFT } from '~/staker/services';

import AppLayout from '~/app/AppLayout';

import { useWorkspace } from '~/workspace/hooks';
import { useNFT } from '~/nft/hooks';
import { Row } from '~/ui';
import CollectionCard from '~/staker/CollectionCard';
import Title from '~/ui/title/Title';

const StakePage = () => {
  const { collections } = useNFT();
  const { provider, wallet } = useWorkspace();
  console.log(collections);

  return (
    <AppLayout>
      <Title>STAKE</Title>
      {collections.map((collection) => (
        <CollectionCard key={collection.collection.id} {...collection} />
      ))}
    </AppLayout>
  );
};

export default StakePage;
