import {flattenConnection, useLocalization} from '@shopify/hydrogen';
import {useCallback, useEffect, useState} from 'react';

const DEFAULT_HANDLE = 'frontpage';
const DEFAULT_SORT_ATTR = 'COLLECTION_DEFAULT';
const DEFAULT_SORT_DIRECTION = false;
const DEFAULT_PAGE_SIZE = 8;
export const useTapitaProductBridge = (props) => {
  const {
    language: {isoCode: language},
    country: {isoCode: country},
  } = useLocalization();

  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState(false);
  const [called, setCalled] = useState(false);

  const {item} = props;

  const name = item.name ?? '';
  let handle = DEFAULT_HANDLE;
  let sortAttr = DEFAULT_SORT_ATTR;
  let reversed = DEFAULT_SORT_DIRECTION;
  let pageSize = DEFAULT_PAGE_SIZE;

  if (item.dataParsed) {
    const {dataParsed} = item;
    if (dataParsed.openCategoryProducts) {
      handle = dataParsed.openCategoryProducts;
    }
    if (dataParsed.openProductsWidthSortAtt) {
      sortAttr = dataParsed.openProductsWidthSortAtt;
    }
    if (dataParsed.openProductsWidthSortDir) {
      reversed = dataParsed.openProductsWidthSortDir.toUpperCase() !== 'DESC';
    }
    if (dataParsed.openProductsWidthSortPageSize) {
      pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
    }
  }

  const url = `/collections/${handle}?language=${language}&country=${country}&limit=${pageSize}&sort_key=${sortAttr}&reversed=${
    reversed ? 1 : 0
  }`;

  const fetchProducts = useCallback(async () => {
    setPending(true);
    setCalled(true);

    const postUrl = new URL(window.location.origin + url);
    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const {data} = await response.json();

    // @ts-ignore TODO: Fix types
    const newProducts = flattenConnection(
      data?.collection?.products || data?.products || [],
    );
    setProducts([...products, ...newProducts]);
    setPending(false);
  }, [url]);

  useEffect(() => {
    if (!products.length && !pending && !called) {
      fetchProducts();
    }
  }, [products.length, pending, called, fetchProducts]);

  return {
    pending,
    products,
    name,
  };
};
