import {TreeDataProductDetailMarkerEnum} from 'tapita-pagebuilder-react';
import {Heading, Section, Text} from '../../elements';
import {useLocalization} from '@shopify/hydrogen';
import {PageHeader} from '../../global';
import {ProductGrid} from '../../product';
import {PartialPreviewClient} from './PartialPreview.client';
import {useManualTapitaCatalog} from '../../../lib/tapita/useManualTapitaCatalog';

export const CollectionLayoutPagePreviewClient = (props) => {
  const {maskedId, data} = props || {};

  const collections = data ? data.collections.nodes : null;
  const collection = collections && collections.length ? collections[0] : null;

  const {data: pageData} = useManualTapitaCatalog({
    maskedId,
  });

  if (!collection) {
    return null;
  }

  const heading = collection.title;
  const handle = collection.handle;

  return (
    <>
      <PageHeader>
        <div className={'tapita-collection-fraction-top'}>
          <PartialPreviewClient
            data={pageData}
            layoutFilter={TreeDataProductDetailMarkerEnum.TOP}
          />
        </div>

        {heading && (
          <Heading
            as="h1"
            width="narrow"
            size="heading"
            className="inline-block"
          >
            {heading}
          </Heading>
        )}
        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <Text format width="narrow" as="p" className="inline-block">
                {collection.description}
              </Text>
            </div>
          </div>
        )}
      </PageHeader>
      <Section>
        <ProductGrid
          key={collection.id}
          collection={collection}
          url={`/collections/${handle}`}
        />
      </Section>
      <Section className={'tapita-collection-fraction-bottom'}>
        <PartialPreviewClient
          data={pageData}
          layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}
        />
      </Section>
      <PartialPreviewClient maskedId={maskedId} />
    </>
  );
};
