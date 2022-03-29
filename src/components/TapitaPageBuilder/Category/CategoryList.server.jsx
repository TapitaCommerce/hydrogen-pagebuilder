import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import {Image, Link} from '@shopify/hydrogen';
export default function CategoryList(props) {
  const item = props.item;

  let image = null;
  if (item && item.dataParsed) {
    const dataParsed = item.dataParsed;
    if (dataParsed.image) {
      image = dataParsed.image;
    }
  }

  const {data} = useShopQuery({
    query: QUERY,
    variables: {},
  });

  const edges = data.collections.edges;
  return (
    <div className="product-list">
      <div className="smpbProductListCtn">
        {edges.map((edge) =>
          image ? (
            <div className="carousel-item-category">
              <Link to={`/collections/${edge.node.handle}`}>
                <Image
                  className="category-list-image"
                  src={image}
                  width={300}
                  height={300}
                />
                <p className="category-name">{edge.node.title}</p>
              </Link>
            </div>
          ) : (
            ''
          ),
        )}
      </div>
    </div>
  );
}


export const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $numProducts: Int!
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      title
      descriptionHtml
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
      products(first: $numProducts) {
        edges {
          node {
            title
            vendor
            handle
            descriptionHtml
            compareAtPriceRange {
              maxVariantPrice {
                currencyCode
                amount
              }
              minVariantPrice {
                currencyCode
                amount
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  priceV2 {
                    currencyCode
                    amount
                  }
                  compareAtPriceV2 {
                    currencyCode
                    amount
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;
