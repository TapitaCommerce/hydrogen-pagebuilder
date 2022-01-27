import {flattenConnection} from '@shopify/hydrogen/client';
import {useQuery} from '@apollo/client';
import ProductCard from './ProductCard.client';
import React from 'react';
import {QUERY} from './ProductList.client';
export default function ProductGrid(props) {
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
    <div className="product-grid">
      <div className="start-grid">
        {products.map((product) => (
          <div className="carousel-item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
