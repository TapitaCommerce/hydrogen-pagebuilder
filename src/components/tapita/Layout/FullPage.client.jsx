import {fetchSync, useServerProps} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {TapitaTranscendentalStatistic} from '~/lib/tapita/TapitaTranscendentalStatistic';
import {SimplifiedPagebuilderClient} from '../Wrapper/SimplifiedPagebuilder.client';
import {defaultFindPagePredicate} from '~/lib/tapita/findBlock/defaultFindPagePredicate';
import {stripSlash} from '~/lib/tapita/stripSlash';
import {findPriortizedPage} from '~/lib/tapita/findBlock/findPriortizedPage';

const DEFAULT_PAGE_NAMESPACE = 'spb_page';

export function FullPageClient(props) {
  const {
    url_path,
    pageNamespace = DEFAULT_PAGE_NAMESPACE,
    findPagePredicate = defaultFindPagePredicate,
    articleHandle,
    blogHandle,
    cacheData = null,
  } = props;
  const {setServerProps} = useServerProps();

  const sth = !cacheData ? fetchSync(`/hydrated_tapita/api`, {}).json() : null;

  const pages = cacheData ? [] : sth?.data?.[pageNamespace]?.items ?? [];

  const currentVar = {
    url_path,
    articleHandle: stripSlash(articleHandle),
    blogHandle: stripSlash(blogHandle),
  };
  const pagesFound = pages.filter((p) => findPagePredicate(p, currentVar));
  const pageFound = findPriortizedPage(pagesFound);

  useEffect(() => {
    if (!pageFound && !cacheData) {
      TapitaTranscendentalStatistic.saveAnalytics(pageFound, setServerProps);
    }
  }, []);

  if (cacheData || pageFound) {
    return (
      <>
        <SimplifiedPagebuilderClient pageData={cacheData || pageFound} />
      </>
    );
  } else {
    return null;
  }
}
