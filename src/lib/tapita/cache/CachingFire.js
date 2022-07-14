import {makeId} from '../makeId';

export const CACHE_DURATION = {
  NO_CACHE: 0,
  RAPID: 60 * 1000,
  SHORT: 5 * 60 * 1000,
  MEDIUM: 15 * 60 * 1000,
  LONG: 60 * 60 * 1000,
  RELATIVELY_LONG: 5 * 60 * 1000,
  SUPER_LONG: 24 * 60 * 60 * 1000,
};

export const GLOBAL_CACHING_NAMESPACE = makeId();

const cacheStore = {};

const globalStatistic = {
  usageCount: 0,
};

const globalCacheSave = (
  key,
  data,
  duration = CACHE_DURATION.SHORT,
  namespace = GLOBAL_CACHING_NAMESPACE,
) => {
  if (!cacheStore[GLOBAL_CACHING_NAMESPACE]) {
    cacheStore[GLOBAL_CACHING_NAMESPACE] = {};
  }
  globalStatistic.usageCount += 1;
  cacheStore[GLOBAL_CACHING_NAMESPACE][key] = {
    data,
    expire: Date.now() + duration,
  };
};

const globalCacheGet = (
  key,
  {
    namespace = GLOBAL_CACHING_NAMESPACE,
    extend = false,
    extendOnVisit = CACHE_DURATION.SHORT,
    hiddenPurge = false,
  } = {},
) => {
  if (!cacheStore[namespace]) {
    return null;
  }
  const retrievalBlock = cacheStore[namespace][key];
  if (!retrievalBlock) {
    return null;
  }
  const timestamp = Date.now();
  if (retrievalBlock.expire >= timestamp) {
    globalStatistic.usageCount += 1;
    retrievalBlock.expire =
      timestamp + CACHE_DURATION.SHORT + (extend ? extendOnVisit : 0);
    if (!hiddenPurge) {
      return retrievalBlock;
    }
    return retrievalBlock.data;
  } else {
    if (hiddenPurge) {
      cacheStore[namespace][key] = null;
      globalStatistic.usageCount -= 1;
      return null;
    } else {
      return {...retrievalBlock, expired: true};
    }
  }
};

export const CachingFire = {
  cacheStore,
  globalStatistic,
  globalCacheSave,
  globalCacheGet,
};
