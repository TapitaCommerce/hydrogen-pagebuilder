import {
  useLocalization,
  useShopQuery,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
  useServerProps,
  CacheLong,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {TapitaTranscendentalStatistic} from '../../lib/tapita/TapitaTranscendentalStatistic';
import {PageClient} from '../../components/tapita/Specific/Page.client';
import {useRefreshingServerCache} from '../../lib/tapita/useRefreshingServerCache';
import {findFinalPage} from '../../lib/tapita/findBlock/findFinalPage';

const BasePage = ({page}) => {
  return (
    <Layout>
      <Suspense>
        <Seo type="page" data={page} />
      </Suspense>
      <PageHeader heading={page.title}>
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className="prose dark:prose-invert"
        />
      </PageHeader>
    </Layout>
  );
};

export default function Page(props) {
  const {params, response} = props;
  response.cache(CacheLong());

  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {handle} = params;
  const {cacheData} = useRefreshingServerCache();
  const pageCache = findFinalPage(cacheData, {
    url_path: handle,
    languageCode,
    countryCode,
  });

  const {
    data: {page},
  } = useShopQuery({
    query: PAGE_QUERY,
    variables: {languageCode, handle},
  });
  const {pending} = useServerProps();

  if (!page && !pageCache) {
    return <NotFound />;
  }
  const intToken = Oxygen.env.TAPITA_INTEGRATION_TOKEN;
  const status = TapitaTranscendentalStatistic.getPageAnalyticBlock(
    props,
    handle,
  );
  const maybeTapitaPage = pageCache||( page.body === '');
  const hasPage = !!intToken && status && maybeTapitaPage;

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.page,
      resourceId: page?page.id:'?',
    },
  });

  return (
    <>
      {pending ? <p>Loading...</p> : null}
      {hasPage ? (
        <PageClient intToken={intToken} page={page} cacheData={pageCache} />
      ) : null}
      {!hasPage ? <BasePage page={page} /> : null}
    </>
  );
}

const PAGE_QUERY = gql`
  query PageDetails($languageCode: LanguageCode, $handle: String!)
  @inContext(language: $languageCode) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
