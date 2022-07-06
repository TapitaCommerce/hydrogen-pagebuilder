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
    intToken,
    url_path,
    pageNamespace = DEFAULT_PAGE_NAMESPACE,
    findPagePredicate = defaultFindPagePredicate,
    articleHandle,
    blogHandle,
  } = props;
  const {setServerProps} = useServerProps();

  const sth = fetchSync(
    `https://tapitaio.pwa-commerce.com/pb/publishedpb/?integrationToken=${intToken}`,
    {
      cache: 'force-cache',
    },
  ).json();

  const pages = sth?.data?.[pageNamespace]?.items ?? [];

  const currentVar = {
    url_path,
    articleHandle: stripSlash(articleHandle),
    blogHandle: stripSlash(blogHandle),
  };
  const pagesFound = pages.filter((p) => findPagePredicate(p, currentVar));
  const pageFound = findPriortizedPage(pagesFound);

  useEffect(() => {
    if (!pageFound) {
      TapitaTranscendentalStatistic.saveAnalytics(pageFound, setServerProps);
    }
  }, []);

  if (pageFound) {
    return (
      <>
        <SimplifiedPagebuilderClient pageData={pageFound} />
      </>
    );
  } else {
    return null;
  }
}
