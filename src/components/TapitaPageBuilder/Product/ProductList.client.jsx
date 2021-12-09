import {flattenConnection, useQuery} from '@shopify/hydrogen/client';
import ProductCard from './ProductCard.client';
import {GET_COLLECTION_QUERY, sendRequest} from './getCollection';
import shopifyConfig from '../../../../shopify.config';
import {useState} from 'react';

function getGqlString(doc) {
    console.log(doc);
  return doc.loc && doc.loc.source.body;
}
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
  const [data, setData] = useState(false);
  const {storeDomain, graphqlApiVersion, storefrontToken} = shopifyConfig;

  if (!data) {
    sendRequest(
      (result) => {
        setData(result);
      },
      getGqlString(GET_COLLECTION_QUERY),
      {
        handle: handle,
        numProducts: pageSize,

numbersOfProducts: 6,
      },
      'CollectionDetails',
    );
  }

  console.log(shopifyConfig);
  console.log(data);
  return 'aa';
  const collection = data.collection;
  const products = flattenConnection(collection.products);
  return (
    <div class="product-list">
      <div id="overall-scroll" class="overall-scroll">
        {products.map((product) => (
          <div class="carousel-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
