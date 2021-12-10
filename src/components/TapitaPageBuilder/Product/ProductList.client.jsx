import {
  flattenConnection,
  ProductProviderFragment,
  MediaFileFragment,
} from '@shopify/hydrogen/client';
import {useQuery} from '@apollo/client';
import ProductCard from '../../ProductCard';
import gql from 'graphql-tag';
//https://www.apollographql.com/docs/react/get-started/

export default function ProductList(props) {
  const item = props.item;
  let handle = null;
  let pageSize = 12;
  if (item && item.dataParsed) {
    const dataParsed = item.dataParsed;
    if (!dataParsed.openCategoryProducts) {
      return null;
    } else {
      handle = item.dataParsed.openCategoryProducts;
    }
    if (dataParsed.openProductsWidthSortPageSize) {
      pageSize = dataParsed.openProductsWidthSortPageSize;
    }
  }
  const {data} = useQuery(QUERY, {
    variables: {
      handle: handle,
      numProducts: pageSize,
    },
    skip: !handle,
  });

  if (!data) return '';
  const collection = data.collection;
  const products = flattenConnection(collection.products);
  return (
    <div class="product-list product-list-client">
      <div class="overall-scroll">
        {products.map((product) => (
          <div class="carousel-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $numProducts: Int!
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      id
      title
      descriptionHtml

      products(first: $numProducts) {
        edges {
          node {
            vendor
            ...ProductProviderFragment
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }

  ${MediaFileFragment}
  ${ProductProviderFragment}
`;
