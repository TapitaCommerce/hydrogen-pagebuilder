import {CollectionCard} from './CollectionCard';
import {getImageLoadingPriority} from '../../../../lib/const';
import {useTapitaCategoryBridge} from '../../../../lib/tapita/useTapitaCategoryBridge';

export const Category = (props) => {
  const {pending, collection} = useTapitaCategoryBridge(props);

  if (pending) {
    return 'Loading...';
  }
  if (!collection) {
    return null;
  }

  return (
    <div className={'constrained-card-player-one-third'}>
      <CollectionCard
        collection={collection}
        key={collection.id}
        loading={getImageLoadingPriority(1, 2)}
      />
    </div>
  );
};
