import {TreeDataProductDetailMarkerEnum} from 'tapita-pagebuilder-react';
import {Section} from '../../elements';
import {ProductOptionsProvider, useLocalization} from '@shopify/hydrogen';

import {PartialPreviewClient} from './PartialPreview.client';
import {useManualTapitaCatalog} from '../../../lib/tapita/useManualTapitaCatalog';

export const ProductLayoutPagePreviewClient = (props) => {
  const {maskedId, data, children} = props || {};

  const product = data ? data.product : null;
  const {data: pageData} = useManualTapitaCatalog({
    maskedId,
  });

  if (!product) {
    return null;
  }

  return (
    <>
      <Section className={'tapita-collection-fraction-top'}>
        <PartialPreviewClient
          data={pageData}
          layoutFilter={TreeDataProductDetailMarkerEnum.TOP}
        />
      </Section>
      {children}
      <Section className={'tapita-collection-fraction-bottom'}>
        <PartialPreviewClient
          data={pageData}
          layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}
        />
      </Section>
    </>
  );
};
