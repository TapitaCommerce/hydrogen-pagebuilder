import {flattenConnection, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import ProductCard from '../../ProductCard.server';
import {Image, Link} from '@shopify/hydrogen';
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

  const {data} = useShopQuery({
    query: QUERY,
    variables: {},
  });

  const edges = data.collections.edges;
  let category = [];
  edges.map((edge) => {
    if (edge.node.handle === handle) {
      category.push(edge);
    }
  });
  return (
    <div class="category-list">
      <Link to={`/collections/${category[0].node.handle}`}>
        <Image class="category-image" src={image} width={300} height={300} />
        <p class="category-name">{category[0].node.title}</p>
      </Link>
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
