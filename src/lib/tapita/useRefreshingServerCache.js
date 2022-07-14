import {useTapitaCache} from './useTapitaCache';
import {CACHE_DURATION, CachingFire} from './cache/CachingFire';
import {TAPITA_DOMAIN_OF_PRESENT} from '../const';

const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
export const FULL_API_REFERENCE_KEY = encodeURIComponent('tapita_tapita');
const DEFAULT_REFRESH_TIME = CACHE_DURATION.SHORT;

const condenseCache = (data) => {
  return data;
};

const SSRCommunicationBlog = {
  fetchFailure: false,
  fetching: true,
};

fetch(
  `${TAPITA_DOMAIN_OF_PRESENT}/publishedpb/?integrationToken=${intToken}`,
  {},
)
  .then((x) => x.json())
  .then((json) => {
    CachingFire.globalCacheSave(
      FULL_API_REFERENCE_KEY,
      condenseCache(json),
      DEFAULT_REFRESH_TIME,
    );
    SSRCommunicationBlog.fetching = false;
  })
  .catch(() => {
    SSRCommunicationBlog.firstFetchFailure = true;
    SSRCommunicationBlog.fetching = false;
  });

export const useRefreshingServerCache = (props) => {
  const {refreshDuration = DEFAULT_REFRESH_TIME} = props || {};

  const {getCache, saveCache} = useTapitaCache({
    hiddenPurge: false,
    extendOnVisit: false,
  });

  const cacheData = getCache(FULL_API_REFERENCE_KEY);

  const getNewData = () => {
    SSRCommunicationBlog.fetching = true;
    return fetch(
      `${TAPITA_DOMAIN_OF_PRESENT}/publishedpb/?integrationToken=${intToken}`,
      {},
    )
      .then((x) => x.json())
      .then((json) => {
        saveCache(FULL_API_REFERENCE_KEY, condenseCache(json), refreshDuration);
        SSRCommunicationBlog.fetching = false;
      })
      .catch(() => {
        SSRCommunicationBlog.firstFetchFailure = true;
        SSRCommunicationBlog.fetching = false;
      });
  };

  if (
    (!cacheData || cacheData.expired || SSRCommunicationBlog.fetchFailure) &&
    !SSRCommunicationBlog.fetching
  ) {
    getNewData();
  }

  return {
    cacheData,
  };
};
