import gql from 'graphql-tag';
import {Image, Link} from '@shopify/hydrogen/client';
import {useQuery} from '@apollo/client';

export default function Category(props) {
  const item = props.item;

  let handle = null;
  let image = null;
  if (item && item.dataParsed) {
    const dataParsed = item.dataParsed;
    if (!dataParsed.openCategoryProducts) {
      return null;
    } else {
      handle = item.dataParsed.openCategoryProducts;
    }
    if (dataParsed.image) {
      image = dataParsed.image;
    }
  }

  const {data} = useQuery(QUERY, {
    variables: {},
  });
  if (!data) return '';
  const edges = data.collections.edges;
  let category = [];
  edges.map((edge) => {
    if (edge.node.handle === handle) {
      category.push(edge);
    }
  });
  return (
    <div style={{textAlign: 'center'}}>
      {image ? (
        <Link to={`/collections/${category[0].node.handle}`}>
          <Image
            className="category-image"
            src={image}
            width={300}
            height={300}
          />
          <p className="category-name">{category[0].node.title}</p>
        </Link>
      ) : (
        ''
      )}
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
