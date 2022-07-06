import {PartialPageClient} from '../Layout/PartialPage.client';
import {TreeDataProductDetailMarkerEnum} from 'tapita-pagebuilder-react';
import {findProductDetailPagePredicate} from '~/lib/tapita/findBlock/findProductDetailPagePredicate';

const ProductLayoutClient = (props) => {
  return (
    <PartialPageClient
      {...props}
      findPagePredicate={findProductDetailPagePredicate}
    />
  );
};

export const ProductLayoutTopClient = (props) => {
  return (
    <ProductLayoutClient
      {...props}
      layoutFilter={TreeDataProductDetailMarkerEnum.TOP}
    />
  );
};

export const ProductLayoutBottomClient = (props) => {
  return (
    <ProductLayoutClient
      {...props}
      layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}
    />
  );
};
