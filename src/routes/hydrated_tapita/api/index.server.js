import {CachingFire} from '../../../lib/tapita/cache/CachingFire';
import {FULL_API_REFERENCE_KEY} from '../../../lib/tapita/useRefreshingServerCache';
import {TAPITA_DOMAIN_OF_PRESENT} from '../../../lib/const';

// TODO: caching and Etag
export async function api(request, {params, queryShop}) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {Allow: 'GET'},
    });
  }

  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const targetURL = `${TAPITA_DOMAIN_OF_PRESENT}/publishedpb/?integrationToken=${intToken}`;
  const cache = CachingFire.globalCacheGet(FULL_API_REFERENCE_KEY);

  const apiCall = async () => {
    return fetch(targetURL, {})
      .then((x) => {
        if (x.status >= 400) {
          throw new Error(x.statusText);
        }
        return x.json();
      })
      .then((json) => {
        CachingFire.globalCacheSave(FULL_API_REFERENCE_KEY, json);
        return json;
      })
      .catch(() => {
        return new Response(
          JSON.stringify({
            error: 'Failure to get data',
          }),
          {
            status: 501,
            headers: {Allow: 'GET'},
          },
        );
      });
  };

  if (cache && !cache.expired) {
    return cache.data;
  }

  return apiCall();
}
