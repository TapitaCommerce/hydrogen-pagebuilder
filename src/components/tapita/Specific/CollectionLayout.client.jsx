import {PartialPageClient} from '../Layout/PartialPage.client';
import {TreeDataProductDetailMarkerEnum} from 'tapita-pagebuilder-react';
import {findCollectionPagePredicate} from '~/lib/tapita/findBlock/findCollectionPagePredicate';

const CollectionLayoutClient = (props) => {
  return (
    <PartialPageClient
      {...props}
      findPagePredicate={findCollectionPagePredicate}
    />
  );
};

export const CollectionLayoutTopClient = (props) => {
  return (
    <CollectionLayoutClient
      {...props}
      layoutFilter={TreeDataProductDetailMarkerEnum.TOP}
    />
  );
};

export const CollectionLayoutBottomClient = (props) => {
  return (
    <CollectionLayoutClient
      {...props}
      layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}
    />
  );
};
