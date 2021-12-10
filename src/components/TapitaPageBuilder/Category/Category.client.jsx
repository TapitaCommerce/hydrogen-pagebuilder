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
