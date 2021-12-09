import {
  flattenConnection,
  MediaFileFragment,
  ProductProviderFragment,
} from '@shopify/hydrogen/client';

import gql from 'graphql-tag';
import ProductCard from './ProductCard.client';
export default function ProductGrid(props) {
  const item = props.item;
  let handle = null;
  let pageSize = 12;
    console.log('aaaa', item);
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

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle: handle,
      numProducts: pageSize,
    },
  });
  console.log('griddata', data);

  const collection = data.collection;
  const products = flattenConnection(collection.products);
  return (
    <div class="product-grid">
      <div class="start-grid">
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
    $numProducts: Int!
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) {
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
