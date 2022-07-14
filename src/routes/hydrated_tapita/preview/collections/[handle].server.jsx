import {
  CacheLong,
  CacheShort,
  gql,
  Seo,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';
import {NotFound} from '../../../../components/global/NotFound.server';
import {validateMaskedId} from '../../../../lib/tapita/validateMaskedId';
import {CollectionLayoutPagePreviewClient} from '../../../../components/tapita/Specific/CollectionLayoutPagePreview.client';
import {Layout} from '../../../../components/global/Layout.server';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

const COLLECTIONS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    collections(first: $pageBy) {
      nodes {
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
        products(first: 5) {
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
  }
`;

export default function (props) {
  const {params, response} = props;
  response.cache(CacheShort());
  const {handle} = params;

  const {
    language: {isoCode: language},
    country: {isoCode: country},
  } = useLocalization();

  const {data} = useShopQuery({
    query: COLLECTIONS_QUERY,
    variables: {
      pageBy: 1,
      country,
      language,
    },
    preload: true,
    cache: CacheLong(),
  });

  if (validateMaskedId(handle)) {
    return (
      <Layout>
        <Seo type="noindex" data={{title: 'Preview'}} />
        <CollectionLayoutPagePreviewClient
          maskedId={handle}
          data={data}
        ></CollectionLayoutPagePreviewClient>
      </Layout>
    );
  } else {
    return <NotFound />;
  }
}
