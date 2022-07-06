import {useLocalization} from '@shopify/hydrogen';
import {useCallback, useEffect, useState} from 'react';

const DEFAULT_HANDLE = 'frontpage';

export const useTapitaCategoryBridge = (props) => {
  const {item} = props;

  const handle = item?.dataParsed?.openCategoryProducts ?? DEFAULT_HANDLE;
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const [collection, setCollection] = useState(null);
  const [pending, setPending] = useState(false);
  const [called, setCalled] = useState(false);

  const url = `/collections/${handle}?language=${languageCode}&country=${countryCode}&light_weight=1`;

  const fetchCategory = useCallback(async () => {
    setPending(true);
    setCalled(true);

    const postUrl = new URL(window.location.origin + url);
    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const {data} = await response.json();
    const collectionData = data?.collection || null;

    setCollection(collectionData);
    setPending(false);
  }, [url]);

  useEffect(() => {
    if (!collection && !pending && !called) {
      fetchCategory();
    }
  }, [collection, pending, called, fetchCategory]);

  return {
    pending,
    collection,
  };
};
