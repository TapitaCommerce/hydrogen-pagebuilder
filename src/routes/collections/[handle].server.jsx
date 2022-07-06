import {Suspense} from 'react';
import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {PageHeader, ProductGrid, Section, Text} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {CollectionLayoutTopClient} from '~/components/tapita/Specific/CollectionLayout.client';
import {Heading} from '~/components';
import {CollectionLayoutBottomClient} from '../../components/tapita/Specific/CollectionLayout.client';

const pageBy = 48;

export default function Collection(props) {
  const {params} = props;
  const {handle} = params;
  const {
    language: {isoCode: language},
    country: {isoCode: country},
  } = useLocalization();

  const {
    data: {collection},
  } = useShopQuery({
    query: COLLECTION_QUERY,
    variables: {
      handle,
      language,
      country,
      pageBy,
    },
    preload: true,
  });

  if (!collection) {
    return <NotFound type="collection" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const heading = collection.title;

  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>

      <PageHeader>
        <div className={'tapita-collection-fraction-top'}>
          <CollectionLayoutTopClient handle={handle} intToken={intToken} />
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
        {collection?.description && (
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
          url={`/collections/${handle}?country=${country}`}
        />
      </Section>
      <Section className={'tapita-collection-fraction-bottom'}>
        <CollectionLayoutBottomClient handle={handle} intToken={intToken} />
      </Section>
    </Layout>
  );
}

// API endpoint that returns paginated products for this collection
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(request, {params, queryShop}) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {Allow: 'POST'},
    });
  }
  const url = new URL(request.url);

  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const language = url.searchParams.get('language');
  const customPageBy = Number.parseInt(url.searchParams.get('limit') || pageBy);
  const customSortKey = url.searchParams.get('sort_key') || 'ID';
  const reversed = url.searchParams.get('reversed') === '1';
  const lightWeight = url.searchParams.get('light_weight') === '1';

  const {handle} = params;

  if (lightWeight) {
    return await queryShop({
      query: LIGHT_WEIGHT_COLLECTION_QUERY,
      variables: {
        handle,
        country,
        language,
      },
    });
  }

  return await queryShop({
    query: PAGINATE_COLLECTION_QUERY,
    variables: {
      handle,
      cursor,
      pageBy: customPageBy,
      country,
      sortKey: customSortKey,
      reversed,
    },
  });
}

const COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $pageBy, after: $cursor) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const PAGINATE_COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionPage(
    $handle: String!
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductCollectionSortKeys
    $reversed: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: $pageBy
        after: $cursor
        sortKey: $sortKey
        reverse: $reversed
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const LIGHT_WEIGHT_COLLECTION_QUERY = gql`
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
    }
  }
`;
