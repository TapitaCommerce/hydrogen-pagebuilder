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

export const CollectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    image {
      altText
      width
      height
      id
      originalSrc
      transformedSrc
    }
    title
    updatedAt
    descriptionHtml
    handle
  }
`;

const QUERY = gql`
  query getCollectionDetails {
    collections(first: 250) {
      edges {
        cursor
        node {
          ...CollectionFragment
        }
      }
    }
  }
  ${CollectionFragment}
`;
