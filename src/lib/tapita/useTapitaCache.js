import {useCallback, useMemo} from 'react';
import {
  CACHE_DURATION,
  GLOBAL_CACHING_NAMESPACE,
  CachingFire,
} from './cache/CachingFire';

export const useTapitaCache = (props) => {
  const {
    cacheDuration = CACHE_DURATION.SHORT,
    namespace = GLOBAL_CACHING_NAMESPACE,
    extendOnVisit = CACHE_DURATION.NO_CACHE,
    hiddenPurge = false,
    extend = true,
  } = props || {};

  const cacheStore = CachingFire.cacheStore;

  const usageCountRef = useMemo(
    () => ({
      current: 0,
    }),
    [],
  );

  const cleanCache = useCallback(() => {
    const visitTimestamp = Date.now();
    let count = 0;
    Object.keys(cacheStore).forEach((key) => {
      const b = cacheStore[key];
      if (b && b.expire > visitTimestamp) {
        cacheStore[key] = null;
        count += 1;
      }
    });
    usageCountRef.current = 0;
    return count;
  }, [cacheStore, usageCountRef]);

  const saveCache = useCallback(
    (key, data, duration = cacheDuration) => {
      if (!cacheStore[namespace]) {
        cacheStore[namespace] = {};
      }
      cacheStore[namespace][key] = {
        data,
        expire: Date.now() + cacheDuration,
      };
      usageCountRef.current += 2;
      if (usageCountRef.current > 30) {
        cleanCache();
      }
    },
    [cacheStore, namespace, cacheDuration, usageCountRef, cleanCache],
  );

  const getCache = useCallback(
    (key) => {
      if (!cacheStore[namespace]) {
        return null;
      }
      const retrievalBlock = cacheStore[namespace][key];
      if (!retrievalBlock) {
        return null;
      }
      const timestamp = Date.now();
      if (retrievalBlock.expire >= timestamp) {
        usageCountRef.current += 1;
        retrievalBlock.expire =
          timestamp + cacheDuration + (extend ? extendOnVisit : 0);
        if (!hiddenPurge) {
          return retrievalBlock;
        }
        return retrievalBlock.data;
      } else {
        if (hiddenPurge) {
          cacheStore[namespace][key] = null;
          usageCountRef.current -= 1;
          return null;
        } else {
          return {...retrievalBlock, expired: true};
        }
      }
    },
    [cacheStore, namespace, usageCountRef],
  );

  const countEntry = useCallback(() => {
    return Object.values(cacheStore).filter((c) => c).length;
  }, [cacheStore]);

  const makeKey = useCallback(({storeCode = '', type = '', urlPath = ''}) => {
    return encodeURIComponent(`${storeCode}||${type}||${urlPath}`);
  }, []);

  return {
    cacheDuration,
    namespace,
    saveCache,
    getCache,
    cleanCache,
    countEntry,
    makeKey,
    cacheStore,
  };
};
