import React from 'react';
import {PageBuilderComponent} from 'tapita-pagebuilder-react';
import {ProductList} from './ProductComponents/ProductList';
import {ProductGrid} from './ProductComponents/ProductGrid';
import {Category} from './ProductComponents/Category';
import {ProductScroll} from './ProductComponents/ProductScroll';

export const SimplifiedPagebuilderClient = (props) => {
  return (
    <PageBuilderComponent
      {...props}
      ProductList={ProductList}
      ProductGrid={ProductGrid}
      ProductScroll={ProductScroll}
      Category={Category}
      // CategoryScroll={CategoryScroll}
    />
  );
};
